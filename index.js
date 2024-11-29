import bodyParser from "body-parser";
import express from "express";
import pg, {Pool} from 'pg';

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin123@localhost:5432/books',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

db.connect();

let books = [
    {
        id:1,
        title: 'You Can Negotiate Anything - by Herb Cohen',
        summary: 'Everything is negotiable. Challenge authority. You have the power in any situation. This is how to realize it and use it. A must-read classic from 1980 from a master negotiator. My notes here aren’t enough because the little book is filled with so many memorable stories — examples of great day-to-day moments of negotiation that will stick in your head for when you need them. (I especially loved the one about the power of the prisoner in solitary confinement.) So go buy and read the book. I’m giving it a 10/10 rating even though the second half of the book loses steam, because the first half is so crucial.',
        dateRead: ' 2023-08-02',
        ratings: '10/10'
    }
]

async function getBooks(){
    const result = await db.query("SELECT * FROM books ORDER by id ASC");
    books = result.rows;
}

app.get("/", async (req, res)=>{
    
    await getBooks();
    res.render("index.ejs", {books: books});
})

// Define the route to handle sorting based on the parameter
app.get("/book/sort/:sortMethod", async (req, res) => {
    const { sortMethod } = req.params;  // Extract the sorting method from the URL
    let query = "SELECT * FROM books";  // Default query

    // Modify the query based on the sorting method
    if (sortMethod === "date_read") {
        query += " ORDER BY date_read ASC";  // Sort by date_read (ascending)
    } else if (sortMethod === "ratings") {
        query += " ORDER BY ratings DESC";  // Sort by ratings (descending)
    } else if (sortMethod === "alphabetically") {
        query += " ORDER BY title ASC";  // Sort alphabetically by book title
    }

    try {
        const result = await db.query(query);
        const books = result.rows;
        res.render("index.ejs", { books });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching books");
    }
});



app.get('/add', (req,res)=>{
    const result = '';
    res.render("add.ejs", {result: result, userId: ''});
})
app.post("/add", async(req, res)=>{
    try {
        const {title, summary, ratings, date_read} = req.body;
        await db.query("INSERT INTO books (title, summary, date_read, ratings) VALUES($1,$2,$3,$4)",[title,summary,date_read,ratings]);
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
  
})
app.post("/edit", async (req,res)=>{
    const id = req.body.edit;
    const findUser = await db.query("SELECT * FROM books WHERE id = $1",[id]);
    const result = findUser.rows;
    console.log(result);
    res.render("add.ejs", {result: result[0], userId:id});
})

app.post("/delete", async (req, res)=>{
    const bookId = req.body.id;

    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    res.redirect("/");
})


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
var express = require("express")
var app = express()

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/api/books", (req, res) => {
  const books = [
    {
      title: "Book Title 1",
      image: "images/book1.jpg",
      link: "About Book Title 1",
      desciption: "Short card text for Book Title 1."
    },
    {
      title: "Book Title 2",
      image: "images/book2.jpg",
      link: "About Book Title 2",
      desciption: "Short card text for Book Title 2."
    },
    {
      title: "Book Title 3",
      image: "images/book3.jpg",
      link: "About Book Title 3",
      desciption: "Short card text for Book Title 3."
    },
    {
      title: "Book Title 4",
      image: "images/book4.jpg",
      link: "About Book Title 4",
      desciption: "Short card text for Book Title 4."
    }
  ]

  res.json(books)
})

var port = process.env.port || 3000
app.listen(port, () => {
  console.log("App listening to: " + port)
})
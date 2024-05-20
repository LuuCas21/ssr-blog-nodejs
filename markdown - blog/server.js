const express = require('express');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost/blog')

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false })); // It gives us access to access the values from the input form directly from the route to create new article
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    // In order to get access to all the articles created we need to invoke the 'Article model'
    const articles = await Article.find().sort({ createdAt: 'desc' })

    res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter);

const port = 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
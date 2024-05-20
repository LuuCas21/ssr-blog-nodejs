const express = require('express');
const Article = require('../models/article');

const router = express.Router();

router.route('/new')
.get((req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.route('/edit/:id')
.get(async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})

router.route('/:slug') // instead of id we will use slug
.get(async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug }); // instead of find by id we will find by slug
    if (article === null) return res.redirect('/');
    res.render('articles/show', { article: article })
})

router.route('/')
.post(async (req, res, next) => { 
    req.article = new Article(); // we're creating a new article and saving it to our request
    next(); // then we're calling next() which is the same as calling the saveArticleAndRedirect()
}, saveArticleAndRedirect('new'))

/*router.route('/')
.post(async (req, res) => { // we're gonna create this route to create new articles
    // this is an asynchronous function
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })

    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`); // instead of routing to id we will route to slug
    } catch (err) {
        console.log(err)
        res.render('articles/new', { article: article }) // If something goes wrong it will redirect the user back to the 'new route', back with all the previous filled infos.
    }
})
*/

router.route('/:id')
.put(async (req, res, next) => {
  req.article = await Article.findByIdAndUpdate(req.params.id);
  next();
}, saveArticleAndRedirect('edit'))

router.route('/:id')
.delete(async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title,
        article.description = req.body.description,
        article.markdown = req.body.markdown
    
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`); 
        } catch (err) {
            console.log(err)
            res.render(`articles/${path}`, { article: article }) 
        }
    }
}

module.exports = router;
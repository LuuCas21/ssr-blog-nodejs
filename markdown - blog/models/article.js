const mongoose = require('mongoose');
const marked = require('marked'); // it allow us to created markdown and turn it into HTML
const slugify = require('slugify'); // it allow us to convert something like a 'title' into an URL friendly slug
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

// we'll calculate the slug every time we create an article

articleSchema.pre('validate', function(next) { // we'll run this function right before we do validation on our article, every single time we save, update, create and delete
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
        // strict will get rid of all characters that doesnt fit in the url
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown)) // it will convert the markdown to html and then purify our html from any malicious code
    }

    next();
})

module.exports = mongoose.model('Article', articleSchema);
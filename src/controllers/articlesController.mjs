import Article from '../models/Article.mjs'

// --- READ: всі статті з проекцією ---
export const getArticlesHandler = async (req, res) => {
  try {
    const articles = await Article.find({}, 'title author createdAt')

    res.render('index', {
      title: 'Articles List',
      page: 'articles/list',
      locals: { articles },
      theme: req.cookies.theme || 'light'
    })
  } catch (error) {
    console.error('Помилка при отриманні статей:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- READ: стаття за ID ---
export const getArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params
    const article = await Article.findById(articleId, 'title author content createdAt')

    if (!article) return res.status(404).send('Article Not Found')

    res.render('index', {
      title: article.title,
      page: 'articles/detail',
      locals: { article },
      theme: req.cookies.theme || 'light'
    })
  } catch (error) {
    console.error('Помилка при отриманні статті:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- CREATE: одна стаття ---
export const postArticlesHandler = async (req, res) => {
  try {
    const { title, content, author } = req.body
    if (!title || !author) return res.status(400).send('Title and Author are required')

    await Article.create({ title, content: content || '', author })

    res.status(201).send('Article created')
  } catch (error) {
    console.error('Помилка при створенні статті:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- UPDATE: одна стаття ---
export const putArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params
    const { title, content, author } = req.body

    const result = await Article.updateOne({ _id: articleId }, { title, content, author })

    if (result.matchedCount === 0) return res.status(404).send('Article Not Found')

    res.status(200).send(`Updated article: ${articleId}`)
  } catch (error) {
    console.error('Помилка при оновленні статті:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- REPLACE: повна заміна документа ---
export const replaceArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params
    const { title, content, author } = req.body

    const result = await Article.replaceOne(
      { _id: articleId },
      { _id: articleId, title, content, author, createdAt: new Date() }
    )

    if (result.matchedCount === 0) return res.status(404).send('Article Not Found')

    res.status(200).send(`Replaced article: ${articleId}`)
  } catch (error) {
    console.error('Помилка при заміні статті:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- DELETE: одна стаття ---
export const deleteArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params
    const result = await Article.deleteOne({ _id: articleId })

    if (result.deletedCount === 0) return res.status(404).send('Article Not Found')

    res.status(204).send('')
  } catch (error) {
    console.error('Помилка при видаленні статті:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- bulk операції ---
export const insertManyArticles = async (articlesArray) => {
  return await Article.insertMany(articlesArray)
}

export const updateManyArticles = async (filter, update) => {
  return await Article.updateMany(filter, update)
}

export const deleteManyArticles = async (filter) => {
  return await Article.deleteMany(filter)
}

// --- CURSOR: отримання статей ---
export const getArticlesCursorHandler = async (req, res) => {
  try {
    const cursor = Article.find({}, 'title author').cursor()
    const articles = []

    for await (const article of cursor) {
      articles.push(article)
    }

    res.status(200).json({
      count: articles.length,
      articles
    })
  } catch (error) {
    console.error('Помилка при обробці курсора статей:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- AGGREGATION: статистика статей ---
export const getArticlesStatsHandler = async (req, res) => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: '$author',
          totalArticles: { $sum: 1 },
          avgTitleLength: { $avg: { $strLenCP: '$title' } }
        }
      },
      { $sort: { totalArticles: -1 } }
    ])

    res.status(200).json(stats)
  } catch (error) {
    console.error('Помилка при агрегації статей:', error)
    res.status(500).send('Internal Server Error')
  }
}

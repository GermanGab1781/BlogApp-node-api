const router = require('express').Router();

const { Book } = require('../../db');

router.get('/', async (req, res) => {
	const books = await Book.findAll();
	res.json(books);
});

router.get('/userBooks/:userId' ,async (req,res)=>{
  const userBooks = await Book.findAll({where:{userId:req.params.userId}});
  res.json(userBooks)
})

router.get('/:bookId', async (req, res) => {
	const book = await Book.findByPk(req.params.bookId);
	return book !== null ? res.json(book) : res.send({ error: 'No book with that id' });
});

router.post('/', async (req, res) => {
	const book = await Book.create(req.body);
  res.json(book);
});

router.put('/:bookId', async (req, res) => {
  await Book.update(req.body, {
		where: { id: req.params.bookId }
	});
	res.json({ success: 'Book successfully modified' });
});

router.delete('/:bookId', async (req, res) => {
	await Book.destroy({ 
		where: { id: req.params.bookId }
	});
	res.json({ success: 'Book successfully deleted' });
});

module.exports = router;
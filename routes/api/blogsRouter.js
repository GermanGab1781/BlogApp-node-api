const router = require('express').Router();
const { Blog } = require('../../db');


router.get('/', async (req, res) => {
	const blogs = await Blog.findAll();
	res.json(blogs);
});

router.get('/userBlogs/:userId' ,async (req,res)=>{
  const userBlogs = await Blog.findAll({where:{userId:req.params.userId}});
  res.json(userBlogs)
})

router.get('/:blogId', async (req, res) => {
	const blog = await Blog.findByPk(req.params.blogId);
	return blog !== null ? res.json(blog) : res.send({ error: 'No blog with that id' });
});

router.post('/', async (req, res) => {
	const blog = await Blog.create(req.body);
  res.json(blog);
});

router.put('/:blogId', async (req, res) => {
  await Blog.update(req.body, {
		where: { id: req.params.blogId }
	});
	res.json({ success: 'Blog successfully modified' });
});

router.delete('/:blogId', async (req, res) => {
	await Blog.destroy({ 
		where: { id: req.params.blogId }
	});
	res.json({ success: 'Blog successfully deleted' });
});

module.exports = router;
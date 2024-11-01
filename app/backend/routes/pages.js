import express from "express"

const router  = express.Router();

router.get('/' , (req , res) => {
    res.render('index');
})


router.get('/login' , (req , res) => {
    res.render('login');
})


router.get('/register' , (req , res) => {
    res.render('register');
})

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
});

export default router;
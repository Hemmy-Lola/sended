import session from 'express-session';
import db from '../db.js'




// Initialize multer with the storage configuration


export const register = (req , res) => {
    // console.log(req.body);
    const {firstname , lastname,  mail , password} = req.body;
    db.query('SELECT mail FROM Users WHERE mail = ?' , [mail] ,async (error , results) => {
        if(error)console.log(error);
        if(results.length > 0){
            return res.render('register' , {
                message : "USER ALREADY EXISTS"
            })
        }
        
    db.query('INSERT INTO Users SET ? ' , {firstname : firstname , lastname : lastname , mail : mail  , password : password } , (error , results) => {
        if(error)console.log(error);
        else {
            // console.log(results);
            
            return res.render('register' , {
                message : "USER REGISTERED ..."
            })
            
        }
        
    })
    });

    // res.send('form submitted ');    
}

export const login = (req , res) => {
    // console.log(req.body);
    const {mail , password} = req.body;
    console.log(req.body);
    db.query('SELECT * FROM Users WHERE mail = ? AND password = ?', [mail, password], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
    
        
        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        req.session.user = results[0]; // Assuming you're using sessions
        res.redirect('/profile');
      });


    // res.send('form submitted ');    
}



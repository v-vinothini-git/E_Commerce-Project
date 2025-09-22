const express = require('express');
const database = require('../db.js');
const mysql = require('mysql');
const bcrypt =require('bcrypt');
const db = database.db;

const createUser = async (req,res)=>{
    let userName = req.body.userName;
    let email = req.body.email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    await db.getConnection(async(err,connection)=>{
        if(err)
            throw err;
        const existing_user = " SELECT * FROM users WHERE userName = ? AND email = ?";
        const existing_user_query = mysql.format(existing_user,[userName,email,hashedPassword]);

        await connection.query(existing_user_query,async (err,result)=>{
           if(err)
            throw err;
           if(result.length !=0)
           {
            console.log("user already exists!");
            connection.release();
           }
           else{
            const createId = "INSERT INTO users VALUES(0,?,?,?)";
            const createId_query = mysql.format(createId,[userName,email,hashedPassword]);

            connection.query(createId_query,(err,result)=>{
                if(err)
                    throw err;
                console.log("user created successfully");
                connection.release();
                res.json({result});
            });
           }
        });
    });
};

const loginUser = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    await db.getConnection(async (err,connection)=>{
        if(err)
           throw err;

        const user_search = "SELECT * FROM users WHERE email = ?";
        const user_search_query = mysql.format(user_search,[email]);

        connection.query(user_search_query,async (err,result)=>{
            if(err)
                throw err;
            if(result.length == 0)
            {
                console.log("email id doesn't exists! kindly register");
                connection.release();
            }
            else{
                  const hashedPassword = result[0].password; 
                  await bcrypt.compare(password,hashedPassword,async (err,passwordMatch)=>{
                     if(err) 
                         throw err;
                     if(passwordMatch)
                        {
                        console.log("logged in successfully");
                        connection.release();
                        res.json({result});
                     }
                    else{
                        console.log("email and password didn't match");
                        connection.release();
                     }
                  });
                

            }



        });
        });
    };
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;

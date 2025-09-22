const express = require('express');
const database = require('../db.js');
const mysql = require('mysql');
const db=database.db;

const addProduct = async (req,res)=>{
   const cartItem  = req.body.cartItem;
   console.log(cartItem);

    db.getConnection(async(err,connection)=>{
       if(err) 
            throw err;

        const alreadyInCart = "SELECT * from cart WHERE uid = ? AND pid = ?";
        const alreadyInCart_query = mysql.format(alreadyInCart,[cartItem.userId,cartItem.pid]);
          await connection.query(alreadyInCart_query, async (err,result)=>{
            if(err)
                throw err;

            if(result.length == 0){
                const addInCart = "INSERT INTO cart VALUES(0,?,?,?)";
                const addInCart_query = mysql.format(addInCart,[cartItem.userId,cartItem.pid,cartItem.quantity]);

                await connection.query(addInCart_query,async (err,result)=>{
                    if(err)
                       throw err;

                    console.log("product added to cart successfully");
                    connection.release();
                })
            }
            else{
                const incrementQuantity = "UPDATE cart SET quantity = quantity + 1 WHERE uid = ? AND pid = ?";
                const incrementQuantity_query = mysql.format(incrementQuantity,[cartItem.userId,cartItem.pid]);

                await connection.query(incrementQuantity_query,async (err,result)=>{
                    if (err)
                        throw err;

                    console.log("incremented successfully");
                    connection.release();
                });
            }
         });
        
    });

};
const getProducts = async (req,res)=>{
   const userId = req.params.userId;
   console.log(userId);
   db.getConnection(async (err,connection)=>{
    if(err)
        throw err;

    const selectProducts = `
    SELECT Products.*, cart.quantity
    FROM cart
    JOIN products ON cart.pid = products.productId
    WHERE cart.uid = ? 
    `;

    const selectProducts_query = mysql.format(selectProducts,[userId]);
    await connection.query(selectProducts_query,async (err,result)=>{
        if(err)
            throw err;

        connection.release();
        console.log("exported successfully");
        
        res.json({result});

   })
   });
};
const removeProduct = async (req,res) => {
  const uid = req.body.userId;
  const pid = req.body.pid;
   
  await db.getConnection(async (err,connection)=>{
    if(err)
        throw err;

    const remove = "DELETE FROM cart WHERE uid = ? AND pid = ?";
    const remove_query = mysql.format(remove,[uid,pid]);

    await connection.query(remove_query,async(err,result)=>{
        if(err)
            throw err;

        console.log("product removed successfully");
        connection.release();
    });
  });

};
const updateQuantity = async (req,res)=>{
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantityValue;

    await db.getConnection(async (err,connection)=>{
        if(err)
            throw err;

        const update = "UPDATE cart SET quantity = ? WHERE uid = ? AND pid = ?";
        const update_query = mysql.format(update,[quantity,userId,productId]);

        await connection.query(update_query,async (err,result)=>{
        if(err)
            throw err;
        console.log("quantity updated successfully");
        connection.release();
        });
    });

}
module.exports.addProduct = addProduct;
module.exports.getProducts = getProducts;
module.exports.removeProduct = removeProduct;
module.exports.updateQuantity = updateQuantity;
 
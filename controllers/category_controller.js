
var db = require('../config/db');
let fs = require('fs');

exports.createCategory = function(req,res){
    console.log("req.body :", req.body);
    let data = req.body;
    const category_name = data.categoryName
    let feature_img = '';
    const category_description = data.description;
    const status = data.status;
    try{
        feature_img = req.files.featureImg.name;
    }catch(error){
        res.status(503).json({
            status: "failed",
            error: `category's feature_img is mandatory`
        });
    }
    
    if(!category_name){
        return res.status(503).json({
            status: "failed",
            error: 'category_name is mandatory'
        });
    }
    if(!feature_img){
        return res.status(503).json({
            status: "failed",
            error: 'create category is rejected due to invalid Image'
        });
    }
    if(!category_description){
        return res.status(503).json({
            status: "failed",
            error: 'category description is mandatory'
        });
    }
    if(!status){
        return res.status(503).json({
            status: "failed",
            error: 'category status is mandatory'
        });
    }
    let path = `assets/images/categories/`+feature_img;
    fs.writeFile(path, req.files.featureImg.data, function (err) {
        if (err) 
            return res.status(503).json({
                status: "failed",
                error: 'create category is rejected due to error while Image saving'
            });
        console.log('Image Saved!');
    });
    
    data = [
        category_name,
        feature_img,
        category_description,
        status,
    ];
    const sql = `INSERT INTO asm_mt_category  (category_name, 
                    feature_img, 
                    category_description, 
                    status, 
                    created_date,
                    updated_date) 
                    values (?, ?, ?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())`;
    db.query(sql, data, (err, rows)=>{
        console.log(err);
        console.log(rows);
        if(err){
            console.log(err.message);
            return res.json({
                status: "failed",
                error: err.message
            });
        }
        else{
           return res.json({
                status: "succes",
                id: rows.insertId
            });
        }
    })
}


exports.getAllCategories = function(req,res){
    
    db.query(`SELECT id, 
                category_name, 
                CONCAT('images/categories/', feature_img) as product_img, 
                category_description, 
                status, 
                FROM_UNIXTIME(created_date, '%Y-%m-%d %H:%i:%s') as created_date,
                FROM_UNIXTIME(updated_date, '%Y-%m-%d %H:%i:%s') as updated_date
                from asm_mt_category where status = 1`, function (err, rows, fields) {
        if (!err)
            return res.json({
                status: 'success',
                data: rows
            })
        else
            return res.json([{
                status: 'failed',
                errMsg: 'Error while performing query.'
            }])
    });
}
// if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif"||file.mimetype == "image/svg" ){

//     file.mv('public/images/upload_images/'+file.name, function(err) {
//     message = "This format is not allowed , please upload file with '.png','.gif','.jpg','.svg'";


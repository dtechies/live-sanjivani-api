const { CategoryModel,SubcategoryModel,FavoriteModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.allCategory = async (req, res, next) => {
    let category= await CategoryModel.findAll()
    console.log(category)
    if(category.length){
        return res.json(constants.responseObj(true, 200, constants.messages.success, false, category))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoCategory))
    }  
}

exports.allCatSubCategory = async (req, res, next) => { 
    let category= await CategoryModel.findAll({raw: true})
    if(category.length){
        let subcategory= await SubcategoryModel.findAll({raw: true})
        if(subcategory.length){
           let favorites= await FavoriteModel.findAll({where:{user_id:req.body.user_id},raw: true})
            for(let i=0;i<category.length;i++){
                let arrObj=[]
                for(let j=0;j<subcategory.length;j++){
                    subcategory[j].value="0" 
                    if(favorites.length){
                        for(let k=0;k<favorites.length;k++){
                            if(favorites[k].subcategory_id==subcategory[j].id){
                                subcategory[j].value=favorites[k].value
                            }
                        }
                    }                   
                    if(category[i].id==subcategory[j].category_id){
                        arrObj.push(subcategory[j])
                    }
                }
                category[i].subcategory=arrObj
            }
            return res.json(constants.responseObj(true, 200, constants.messages.success, false, category))
        }else{
            return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
        }
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoCategory))
    }  
}

exports.generatePdf = async (req, res, next) => { 
    let category= await CategoryModel.findAll({raw: true})
    if(category.length){
        let subcategory= await SubcategoryModel.findAll({raw: true})
        if(subcategory.length){
           let favorites= await FavoriteModel.findAll({where:{user_id:req.body.user_id},raw: true})
            for(let i=0;i<category.length;i++){
                let arrObj=[]
                for(let j=0;j<subcategory.length;j++){
                    subcategory[j].value="0" 
                    if(favorites.length){
                        for(let k=0;k<favorites.length;k++){
                            if(favorites[k].subcategory_id==subcategory[j].id){
                                subcategory[j].value=favorites[k].value
                            }
                        }
                    }                   
                    if(category[i].id==subcategory[j].category_id){
                        arrObj.push(subcategory[j])
                    }
                }
                category[i].subcategory=arrObj
            }
            return res.json(constants.responseObj(true, 200, constants.messages.success, false, category))
        }else{
            return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
        }
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoCategory))
    }  
}

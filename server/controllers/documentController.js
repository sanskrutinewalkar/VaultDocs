const { getGFS } = require('../config/gridfs');
const { Readable } = require('stream');
const Document = require ('../models/Document');

const createDocument = async (req , res) =>{
    try{
        const {title , type , expiryDate} = req.body;
        
        if (!title){
            return res.status(400).json({
                message:'Title required'
            });
        }

        const doc = await Document.create({
            owner: req.user.id,
            title,
            expiryDate: expiryDate || null,
        });

        res.status(201).json(doc);
    } catch (error){
        res.status(500).json({message: 'Server error',error: error.message});
    }

};

const getMyDocs = async (req,res)=>{
    try{
      const docs = await Document.find({owner: req.user.id}).sorrt({createdAt: -1});
      res.status(200).json(docs);
    } catch(error){
        res.status(500).json({
            message:'server error',error: error.message
        });
    }
};


const getDocumentById = async(req, res)=>{
    try{
      const document = await Document.findOne({_id: req.params.id , owner: req.user.id});
      if(!document) 
        return res.status(404).json({message:'Oops! Document not found.'});
    else
        return res.status(200).json(document);
    }catch(error){
        res.status(500).json({message:'server errror',error:error.message});
    }
};

const updateDocument = async (req, res)=>{
    try{
       const {title, type , expiryDate}= req.body;

       const document = await Document.findOneAndUpdate(
        {_id: req.params.id , owner : req.user.id},
        {title , type, expiryDate},
        {new: true , runValidators:true}
       );

       if(!doc)
        return res.status(404).json({message:'Document not found'});
       else
        return res.status(200).json(document);
    } catch(error){
        res.status(500).json({message:'server error',error:error.message});
    }
};


const deleteDocument = async(req, res)=>{
    try{
      const document = await Document.findOneAndDelete({_id: req.params.id , owner: req.user.id});
      if(!document)
        return res.status(404).json({message:'Document not found.'});
    else 
        return res.status(200).json({message:'Document deleted successfully'});
    } catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
};


module.exports ={createDocument, getMyDocs, getDocumentById, updateDocument , deleteDocument};


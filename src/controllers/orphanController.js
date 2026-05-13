const Orphans = require("../models/Orphans");

// Get all orphan /api/orphans
const getAllOrphan = async (req , res)=>{
    try {
        const Orphan= await Orphan.findAll();
        res.status(200).json(Orphan);
    } catch(error){
        res.status(500).json({ message : error.message});
    }
};

// Get an orphan By Id  /api/orphans/:id
  const getOrphanById = async (req ,res)=>{
    try{
        const Orphan = await Orphan.findByPk(req.params.id)
        if(!Orphan){
            return res.status(404).json({ message :" orphan not found "});
        }
        res.status(200).json(Orphan);
    } catch(error){
        res.status(500).json({ message : error.message});
    }

  } ;


  // Create an /api/admin/orphans
  const CreatOrphan = async (req , res )=>{
    try {
        const Orphan = await Orphan.CreatOrphan(req.body);
        res.status(201).json(Orphan);
    } catch(error){
        res.status(500).json({message :error.message});
    }

  };

  // Update an orphan /api/admin/orphans/:id
  const UpdateOrphan = async (req , res )=>{
    try{
        const Orphan = await Orphan.findByPk(req.params.id);
        if(!Orphan){
            return res.status(404).json({ message :" orphan not found "});
        }
    } catch(error){
        res.status(500).json({ message : error.message});
    }

  };



  // Delete an orphan /api/admin/orphans/:id
  const DeleteOrphan = async (req , res )=>{
    try{
        const Orphan = await Orphan.findByPk(req.params.id);
        if(!Orphan){
            return res.status(404).json({ message :" orphan not found "});
        }
        await Orphan.destroy();
        res.status(200).json({  success: true, message : "Orphan deleted successfully"});
    } catch(error){
        res.status(500).json({ message : error.message});
    }

  };

  module.exports = {
    getAllOrphan,
    getOrphanById,
    CreatOrphan,
    UpdateOrphan,
    DeleteOrphan
  };
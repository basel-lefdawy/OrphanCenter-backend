const orphanService = require("../services/orphanService");

// Get all orphan /api/orphans
const getAllOrphan = async (req , res)=>{
    try {
        const orphans = await orphanService.getAllOrphan();
        res.status(200).json(orphans);
    } catch(error){
        res.status(500).json({ message : error.message});
    }
};

// Get an orphan By Id  /api/orphans/:id
  const getOrphanById = async (req ,res)=>{
    try{
        const orphan = await orphanService.getOrphanById(req.params.id);
        if(!orphan){
            return res.status(404).json({ message :"orphan not found"});
        }
        res.status(200).json(orphan);
    } catch(error){
        res.status(500).json({ message : error.message});
    }

  } ;


  // Create an /api/admin/orphans
  const createOrphan = async (req , res )=>{
    try {
        const orphan = await orphanService.createOrphan(req.body);
        res.status(201).json(orphan);
    } catch(error){
        res.status(500).json({message :error.message});
    }

  };

  // Update an orphan /api/admin/orphans/:id
  const updateOrphan = async (req , res )=>{
    try{
        const orphan = await orphanService.updateOrphan(req.params.id, req.body);
        if(!orphan){
            return res.status(404).json({ message :"orphan not found"});
        }
        res.status(200).json(orphan);
    } catch(error){
        res.status(500).json({ message : error.message});
    }

  };



  // Delete an orphan /api/admin/orphans/:id
 const deleteOrphan = async (req , res )=>{
    try{
        const orphan = await orphanService.deleteOrphan(req.params.id);

        if(!orphan){
            return res.status(404).json({
                message : "orphan not found"
            });
        }

        res.status(200).json({
            success: true,
            message : "Orphan deleted successfully"
        });

    } catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

  module.exports = {
    getAllOrphan,
    getOrphanById,
    createOrphan,
    updateOrphan,
    deleteOrphan
  };
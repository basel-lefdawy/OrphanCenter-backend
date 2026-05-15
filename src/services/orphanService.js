const { Orphan } = require("../models");

// Get all orphan /api/orphans
const getAllOrphan = async ()=>{
  return await Orphan.findAll();
}

// Get an orphan By Id  /api/orphans/:id
const getOrphanById= async (id)=>{
  return await Orphan.findByPk(id);
};

// Create an /api/admin/orphans
const createOrphan = async (orphanData)=>{
return await Orphan.create(orphanData);
};


// Update an orphan /api/admin/orphans/:id
const updateOrphan = async (id, updatedData)=>{
  const orphan = await Orphan.findByPk(id);

  if(!orphan){ 
    return null ;
  }

  await orphan.update(updatedData);
  return orphan ;
};


// Delete an orphan /api/admin/orphans/:id
const deleteOrphan = async(id)=>{
  const orphan = await Orphan.findByPk(id);

  if(!orphan){
    return null;
  }
  await orphan.destroy();

  return true ;
};

module.exports = {
    getAllOrphan,
    getOrphanById, 
    createOrphan,
    updateOrphan,
    deleteOrphan
}
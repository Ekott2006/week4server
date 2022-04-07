const mongoose = require("mongoose")

const UploadSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }},
    {
        timestamps: true    
    }
);

module.exports =  mongoose.model('Upload', UploadSchema);

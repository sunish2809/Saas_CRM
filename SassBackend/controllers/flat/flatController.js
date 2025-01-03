const flat = require("../../models/Flat");

exports.addFlatTenants = async (req, res) =>{
    let{
        name,
        address,
        aadhar,
        mobile,
        paymentHistory,
        flatNumber

    } = req.body;
    if(!name||!address||!aadhar||!mobile||!paymentHistory||!flatNumber)
    {
        return res.status(400).json({message:"please fill all the mandatory feilds"});
    }
    name = name.trim().replace(/\s+/g, " ");
    address= address.trim().replace(/\s+/g, " ");
    aadhar = aadhar.trim().replace(/\s+/g, " ");

    try{
        const newTenant = new flat({
            name,
            address,
            aadhar,
            mobile,
            paymentHistory,
            flatNumber
        })
        await newTenant.save();
        res
        .status(201)
        .json({ message: "Tenant added successfully", tenant: newTenant });
        
    }catch(error)
    {
        If (error.code === 11000) 
        {
            res.status(400).json({ message: "Seat number must be unique" })
        }
        res.status(500).json({message:"Error adding tenants",error})
        

    }
    

}

exports.updateFlatTenants = async(req, res) =>{
    let{
        flatNumber,
        amountPaid

    } = req.body;
    if(!flatNumber ||!amountPaid)
    {
        return res.status(400).json({message:"please provide the required details"})
    }
    try{
        const tenant = flat.findOne({ flatNumber })
        if(!tenant)
        {
            res.status(404).json({message:"Tenant not found"})
        }
        tenant.paymentHistory.push({ amountPaid });
        await tenant.save();
        res
        .status(201)
        .json({ message: "Tenant Updated successfully", tenant: tenant });
        
    }
    catch(error){
        res.status(500).json({ message: "Error updating payment", error });
    }
}

exports.deleteTenants= async(req, res)=>{
    const { flatNumber} = req.body;

    if ( !flatNumber) {
    return res
        .status(400)
        .json({ message: "Please provide Flat Number" });
    }

    try {
    // Find and delete the student by name and seatNumber
    const deletedTenant = await flat.findOneAndDelete({
        flatNumber
    });

    if (!deletedTenant) {
        return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({
        message: "Tenant deleted successfully",
        tenant: deletedTenant,
    });
    } catch (error) {
    res.status(500).json({ message: "Error deleting tenant", error });
    }

}

exports.getTenant = async(req, res)=>{
    const { flatNumber } = req.body;

    try {

        const tenant = await flat.find({
        flatNumber
        });

        if (!tenant.length) {
        return res
            .status(404)
            .json({ message: "No tenant found with that name" });
        }

        res.json(tenant);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tenant", error });
    }
}

exports.getAllTenants = async(req, res) =>{
    try {
    const tenant = await flat.find({}, { name: 1, flatNumber: 1, paymentHistory: 1,_id: 0 });

    if (!tenant.length) {
        return res.status(404).json({ message: "No tenants found" });
    }

    res.json(tenant);
    } catch (error) {
    res.status(500).json({ message: "Error fetching tenants", error });
    }
}
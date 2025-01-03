const library = require("../../models/Library")

exports.addLibraryMembers = async (req, res) =>{
    let{
        name,
        address,
        aadhar,
        mobile,
        paymentHistory,
        package,
        seatNumber,


    } = req.body;
    if(!name||!address||!aadhar||!mobile||!paymentHistory||!seatNumber||!package)
    {
        return res.status(400).json({message:"please fill all the mandatory feilds"});
    }
    name = name.trim().replace(/\s+/g, " ");
    address= address.trim().replace(/\s+/g, " ");
    aadhar = aadhar.trim().replace(/\s+/g, " ");
    package= package.trim().replace(/\s+/g, " ");

    try{
        const newMember = new library({
            name,
            address,
            aadhar,
            mobile,
            paymentHistory,
            package,
            seatNumber
        })
        await newMember.save();
        res
        .status(201)
        .json({ message: "Library Member added successfully", member: newMember });
        
    }catch(error)
    {
        If (error.code === 11000) 
        {
            res.status(400).json({ message: "Member number must be unique" })
        }
        res.status(500).json({message:"Error adding members",error})
        

    }
    

}

exports.updateLibraryMembers= async(req, res) =>{
    let{
        seatNumber,
        package,
        amountPaid

    } = req.body;
    if(!seatNumber ||!amountPaid||!package)
    {
        return res.status(400).json({message:"please provide the required details"})
    }
    try{
        const member = library.findOne({ seatNumber})
        if(!member)
        {
            res.status(404).json({message:"member not found"})
        }
        member.paymentHistory.push({ amountPaid });
        await member.save();
        res
        .status(201)
        .json({ message: "member Updated successfully", member: member });
        
    }
    catch(error){
        res.status(500).json({ message: "Error updating payment", error });
    }
}

exports.deleteLibraryMembers= async(req, res)=>{
    const { seatNumber} = req.body;

    if ( !seatNumber) {
    return res
        .status(400)
        .json({ message: "Please provide member Number" });
    }

    try {
    const deletedmember = await library.findOneAndDelete({
        seatNumber
    });

    if (!deletedmember) {
        return res.status(404).json({ message: "member not found" });
    }

    res.json({
        message: "member deleted successfully",
        member: deletedmember,
    });
    } catch (error) {
    res.status(500).json({ message: "Error deleting member", error });
    }

}

exports.getLibraryMembers = async(req, res)=>{
    const { seatNumber} = req.body;

    try {

        const member = await library.find({
            seatNumber
        });

        if (!member.length) {
        return res
            .status(404)
            .json({ message: "No member  found with that name" });
        }

        res.json(member );
    } catch (error) {
        res.status(500).json({ message: "Error fetching member", error });
    }
}

exports.getAllLibraryMembers = async(req, res) =>{
    try {
    const member = await library.find({}, { name: 1, seatNumber: 1, paymentHistory: 1,_id: 0 });

    if (!member.length) {
        return res.status(404).json({ message: "No member found" });
    }

    res.json(member);
    } catch (error) {
    res.status(500).json({ message: "Error fetching member", error });
    }
}
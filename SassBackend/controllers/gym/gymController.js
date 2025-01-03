const gym = require("../../models/Gym")

exports.addGymMembers = async (req, res) =>{
    let{
        name,
        address,
        aadhar,
        mobile,
        paymentHistory,
        package,
        memberNumber,


    } = req.body;
    if(!name||!address||!aadhar||!mobile||!paymentHistory||!memberNumber||!package)
    {
        return res.status(400).json({message:"please fill all the mandatory feilds"});
    }
    name = name.trim().replace(/\s+/g, " ");
    address= address.trim().replace(/\s+/g, " ");
    aadhar = aadhar.trim().replace(/\s+/g, " ");
    package= package.trim().replace(/\s+/g, " ");

    try{
        const newMember = new gym({
            name,
            address,
            aadhar,
            mobile,
            paymentHistory,
            package,
            memberNumber
        })
        await newMember.save();
        res
        .status(201)
        .json({ message: "Gym Member added successfully", member: newMember });
        
    }catch(error)
    {
        If (error.code === 11000) 
        {
            res.status(400).json({ message: "Member number must be unique" })
        }
        res.status(500).json({message:"Error adding members",error})
        

    }
    

}

exports.updateGymMembers= async(req, res) =>{
    let{
        memberNumber,
        package,
        amountPaid

    } = req.body;
    if(!memberNumber ||!amountPaid||!package)
    {
        return res.status(400).json({message:"please provide the required details"})
    }
    try{
        const member = gym.findOne({ memberNumber})
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

exports.deleteGymMembers= async(req, res)=>{
    const { memberNumber} = req.body;

    if ( !memberNumber) {
    return res
        .status(400)
        .json({ message: "Please provide member Number" });
    }

    try {
    const deletedmember = await gym.findOneAndDelete({
        memberNumber
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

exports.getGymMembers = async(req, res)=>{
    const { memberNumber} = req.body;

    try {

        const member = await gym.find({
        memberNumber
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

exports.getAllGymMembers = async(req, res) =>{
    try {
    const member = await gym.find({}, { name: 1, memberNumber: 1, paymentHistory: 1,_id: 0 });

    if (!member.length) {
        return res.status(404).json({ message: "No member found" });
    }

    res.json(member);
    } catch (error) {
    res.status(500).json({ message: "Error fetching member", error });
    }
}
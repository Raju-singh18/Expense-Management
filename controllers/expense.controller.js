
const Expense = require("../models/Expense");

const createExpense = async(req, res, next) =>{
    try {
        const {title, amount, category, description} = req.body;

        if(!title || amount === undefined || !category){
          return res.status(400).json({
            success:false,
            message:"title, amount, and category are required."
          });
        }

        const expense = await Expense.create(
            {
              userId:req.user.id,
              title,
              amount,
              category,
              description
            }
        );

        return res.status(201).json({
            success:true,
            message:"Expense Created Successfully",
            data: expense
        });
    } catch (error) {
        next(error);
    }
}

const getExpenses = async(req, res, next) =>{
    try {
        const {
            category,
            minAmount,
            maxAmount,
            startDate,
            endDate,
            search,
            page =1,
            limit = 10
        } = req.query;

        const filter = {
            userId : req.user.id
        };

        if(category){
            filter.category.category
        }

        if(minAmount || maxAmount){
            filter.amount = {};
            if(minAmount){
                filter.amount.$gte = Number(minAmount);
            }

            if(maxAmount){
               filter.amount.$lte = Number(maxAmount); 
            }
        }

        if(startDate || endDate){
            filter.createdAt = {};

            if(startDate){
                filter.createdAt.$gte = new Date(startDate);
            }

            if(endDate){
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        if(search){
            filter.$or = [
                {
                    title:{
                        $regex : search,
                        $options:"i"
                    }
                },
                {
                    description:{
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const pageNumber = Math.max(Number(page),1);
        const pageLimit = Math.min(Math.max(Number(limit),1),100);

        const skip = (pageNumber - 1)+ pageLimit;

        const [expenses, total] = await Promise.all([
            (await Expense.find(filter)).sort({createdAt: -1}).skip(skip).limit(pageLimit),
            Expense.countDocuments(filter)
        ]);

        return res.status(200).json({
            success:true,
            data: expenses,
            pagination:{
                total,
                page:pageNumber,
                limit:pageLimit,
                totalPages:Math.ceil(total / pageLimit)
            }
        });

    } catch (error) {
        next(error);
    }
}


const getExpenseById = async(req, res, next) =>{
    try {
        const expense = await Expense.find({
            _id:req.params.id,
            userId:req.user.id
        })

        if(!expense){
           return res.status(404).json({
            success:false,
            message:"Expense not found"
           })
        }

        return res.status(200).json({
            success:true,
            data:expense
        })
    } catch (error) {
        next(error);
    }
}

const updateExpense= async(req, res, next) =>{
    try {
        const expense = await Expense({
            _id: req.params.id,
            userId:req.user.id
        },
     {
        new: true,
        runValidators:true
     }
    );

    if(!expense){
        return res.status(404).json(
            {
                success:false,
                message:"Expense not found"
            }
        )
    }

    return  res.status(200).json({
        success:true,
        data:expense,
    })
    } catch (error) {
        next(error);
    }
}

const deleteExpense = async(req, res, next)=>{
    try {
        const expense = await Expense.findOneAndDelete({
            _id:req.params.id,
            userId: req.user.id
        });

        if(!expense){
            return res.status(404).json(
            {
                success:false,
                message:"Expense not found"
            }
        )
        }

        return res.status(200).json({
            success:true,
            message:"expense deleted successfully."
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
}
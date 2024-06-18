// crud operation starts
import { asyncHandler } from "../utils/asyncHandler.js"
import { modelsMap } from "../modelsMap.js"



const creation = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const createdModel  = await Model.create(data.body);
        return createdModel;
    } catch (error) {
        console.error('Error:',error)
        throw error;
    }
})



export { creation }
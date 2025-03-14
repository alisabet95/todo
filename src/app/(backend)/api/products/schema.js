import { z } from "zod";

const schema = z.object({
        title: z.string().min(2,"title is required").max(50,"too long") 
})

export default schema
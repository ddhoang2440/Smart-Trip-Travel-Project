import { configureStore} from "@reduxjs/toolkit"
import authreducer from './AuthRedux'
import resreducer from './ResRedux'
import menureducer from './MenuRedux'
import commentreducer from './CommentRedux'
import cartreducer from './CartRedux'

export const store = configureStore({
    reducer:  {
        auth: authreducer,
        restaurant: resreducer,
        menu: menureducer,
        comment: commentreducer,
        cart:  cartreducer,
    }
})


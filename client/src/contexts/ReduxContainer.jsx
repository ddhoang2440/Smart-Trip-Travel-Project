import { configureStore} from "@reduxjs/toolkit"
import authreducer from './AuthRedux'
import resreducer from './ResRedux'
import menureducer from './MenuRedux'
import commentreducer from './CommentRedux'
import bookingreducer from './Booking'

export const store = configureStore({
    reducer:  {
        auth: authreducer,
        restaurant: resreducer,
        menu: menureducer,
        comment: commentreducer,
        booking: bookingreducer,
    }
})


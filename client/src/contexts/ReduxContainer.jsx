import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./AuthRedux";
import resreducer from "./ResRedux";
import menureducer from "./MenuRedux";
import commentreducer from "./CommentRedux";
import bookingreducer from "./BookingRedux";
import chatreducer from "./ChatRedux";
import cartreducer from "./CartRedux";
import bookingslotreducer from "./BookingSlotRedux";

export const store = configureStore({
  reducer: {
    auth: authreducer,
    restaurant: resreducer,
    menu: menureducer,
    comment: commentreducer,
    booking: bookingreducer,
    bookingslots: bookingslotreducer,
    chat: chatreducer,
    cart: cartreducer,
  },
});

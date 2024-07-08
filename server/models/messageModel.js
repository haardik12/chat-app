const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: '',
    },

    imageUrl: {
      type: String,
      default: '',
    },

    videoUrl: {
      type: String,
      default: '',
    },

    seen: {
      type: Boolean,
      default: false,
    },

    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const ConversationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },

  receiver: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },

  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'messages',
    },
  ],
}, {
    timestamps: true,
})

const MessageModel = mongoose.model('messages', messagesSchema);
const ConvoModel = mongoose.model('conversation', ConversationSchema);

module.exports = {
    MessageModel,
    ConvoModel
}
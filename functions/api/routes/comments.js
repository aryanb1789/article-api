const express = require('express');
const routes = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Create article
routes.post('/comment', (req, res) => {
    (async () => {
        try {

            const { content, nickName, articleId, commentId } = req.body;
            let creationDate = new Date();

            let errors = [];

            if (!content) {
                errors.push({ message: "Content is required" });
            }

            if (!nickName) {
                errors.push({ message: "Nickname is required" });
            }

            if (errors.length > 0) {
                return res.status(200).json(errors);
            } else {
                await db.collection('comments').doc('/' + commentId + '/')
                    .create({
                        commentId: commentId,
                        articleId: articleId,
                        content: content,
                        nickName: nickName,
                        creationDate: creationDate
                    })

                return res.status(200).json({ message: "Comment is created" });
            }

        }
        catch (error) {
            return res.status(500).json({
                msg: 'Internal Server Error.',
                error: error
            });
        }
    })();
});


// Read all articles
routes.get('/comment', (req, res) => {
    (async () => {
        try {
            let query = db.collection('comments');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs) {
                    const selectedItem = {
                        commentId: doc.data().commentId,
                        articleId: doc.data().articleId,
                        content: doc.data().content,
                        nickname: doc.data().nickname,
                        creationDate: doc.data().creationDate.toDate()
                    };
                    response.push(selectedItem);
                }

                if (response.length === 0) {
                    return res.status(200).json({ message: "No Record Found" });
                } else {
                    return response;
                }
            })

            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error.',
            });

        }
    })();
});



module.exports = routes;
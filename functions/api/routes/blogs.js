const express = require('express');
const routes = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Read all articles
routes.get('/article', (req, res) => {
    (async () => {
        try {
            let query = db.collection('articles').orderBy('id');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs) {
                    let date = new Date(doc.data().creationDate);
                    const selectedItem = {
                        id: doc.data().id,
                        title: doc.data().title,
                        content: doc.data().content,
                        nickName: doc.data().nickName,
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

// Create article
routes.post('/article', (req, res) => {
    (async () => {
        try {

            const { id, title, content, nickName } = req.body;
            let creationDate = new Date();

            let errors = [];

            if (!id) {
                errors.push({ message: "Id is required" });
            }

            if (!title) {
                errors.push({ message: "Title is required" });
            }

            if (!content) {
                errors.push({ message: "Content is required" });
            }

            if (!nickName) {
                errors.push({ message: "Nickname is required" });
            }

            if (errors.length > 0) {
                return res.status(200).json(errors);
            } else {
                await db.collection('articles').doc('/' + id + '/')
                    .create({
                        id: id,
                        title: title,
                        content: content,
                        nickName: nickName,
                        creationDate: creationDate
                    })

                return res.status(200).json({ message: "Article is created" });
            }

        }
        catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error.',
            });
        }
    })();
});

// Read single article
routes.get('/article/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('articles').doc(req.params.id);
            if ((await document.get()).exists) {
                let article = await document.get();
                let response = article.data();

                response.creationDate = response.creationDate.toDate();
                return res.status(200).send(response);
            } else {
                return res.status(404).json({ message: "No Record Found" });
            }

        }
        catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            });

        }
    })();
});

module.exports = routes;
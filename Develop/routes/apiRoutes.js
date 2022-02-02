// const store = require('..db/store');

const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');


router.route("/notes")
    .get((req, res) => {
        readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
    })
    .post((req, res) => {
        console.info(`${req.method} request received to add a note`);

        const { title, text } = req.body;

        if (title && text) {
            const newNote = {
                title,
                text,
                id: uuidv4(),
            };
            fs.readFile('./db/db.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    // Convert string into JSON object
                    const parsedNote = JSON.parse(data);

                    // Add a new note
                    parsedNote.push(newNote);
                    const noteString = JSON.stringify(newNote);

                    fs.writeFile(
                        './db/db.json',
                        JSON.stringify(parsedNote, null, 4),
                        (writeErr) =>
                            writeErr
                                ? console.error(writeErr)
                                : console.info('Successfully updated notes!')
                    );
                }
            });

            const response = {
                status: 'success',
                body: newNote,
            };

            console.log(response);
            res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting note');
        }
    })

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    // Respond to the DELETE request
    res.json(`Item ${noteId} has been deleted `);
});

module.exports = router;
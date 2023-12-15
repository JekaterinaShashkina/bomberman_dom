import frame from '../framework/framework.js'

const app = document.getElementById('app')

app.append(
    frame.createH1({}, "Welcome to Bomberman-DOM"),
    frame.createSection({
        id: "nickname-section"
    },
        frame.createLabel({
            for: "nickname-input"
        }, "Enter your nickname:"),
        frame.createInput({
            type: "text",
            id: "nickname-input",
            placeholder: "Nickname",
        }),
        frame.createButton({
            id: "join-button"
        }, "Join Game")
    ),
    frame.createSection({
        id: "waiting-section"
    },
        frame.createP({},
            "Waiting for players... ",
            frame.createSpan({
                class: "wait__players"
            })
        ),
        frame.createDiv({
            id: "player-counter"
        },
            "Current Players: ",
            frame.createSpan({
                id: "player-count"
            }, "0/4"),
        ),
        frame.createDiv({
            id: "timer"
        },
            "Game starts in:",
            frame.createDiv({
                id: "countdown"
            },
                frame.createSpan({
                    class: "count__sec"
                },
                    " seconds"
                )
            )
        )
    )
)
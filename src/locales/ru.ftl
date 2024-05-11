how-play = Нажимай на ячейки, заполняя поле одним цветом
score = Счет: { $score }
alert-press-to-score = Необходимо нажимать на ячейки с цветом
alert-press-to-current-color = Этот цвет уже выбран
flood-in-score = { NUMBER($score, type: "ordinal") ->
   [one] Поле заполнено за { $score } ход!
   [few] Поле заполнено за { $score } хода!
   *[other] Поле заполнено за { $score } ходов!
}
flood-in = Ура! Поле поле заполнено
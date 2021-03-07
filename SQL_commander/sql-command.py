arr_name_photo = [
"118985.jpg"
]
arr_name = [
"Эмбрион мира. Том 1."
]
arr_cost = [
"435"
]
arr_link = [
"https://fast-anime.ru/Manga/603"
]


for i in range(len(arr_link)):
    id = str(i+1570)

    # f = open('text.txt', 'w')
    # f.write("INSERT INTO `anishop`.`goods` (`id`, `name`, `description`, `cost`, `category_id`, `shop_id`, `photo`, `ref_link`) VALUES ")
    # f.close()
    p = open('text.txt', 'a')
    s = '\''
    p.write("INSERT INTO `anishop`.`goods` (`id`, `name`, `description`, `cost`, `category_id`, `shop_id`, `photo`, `ref_link`) VALUES (" + '\'' + id + '\'' + ', ' + s + arr_name[i] + '\'' + ', ' + '\'Манга от магазина Fast Anime Studio. Дополнительные детали уточняйте у продавца.' + '\', ' + arr_cost[i] + ', ' + '\'' + str(2) + '\'' + ', ' + '\'Fast Anime Studio' + '\'' + ', ' + '\'' + arr_name_photo[i] + '\'' + ', ' + '\'' + arr_link[i] + '\'' + ');\n')

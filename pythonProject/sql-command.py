arr_name_photo = ["PUT YOUR IMAGE'S URL'S HERE"]
arr_name = ["PUT YOUR GOODS NAMES HERE"]
arr_cost = ["PUT YOUR PRICES HERE"]
arr_link = ["PUT YOIR LINKS TO GOODS HERE"]


for i in range(len(arr_link)):
    id = str(i+1) #starter position
    p = open('text.txt', 'a')
    s = '\''
    p.write("INSERT INTO `anishop`.`goods` (`id`, `name`, `description`, `cost`, `category_id`, `shop_id`, `photo`, `ref_link`) VALUES (" + '\'' + id + '\'' + ', ' + s + arr_name[i] + '\'' + ', ' + '\'Describtion' + '\', ' + arr_cost[i] + ', ' + '\'' + str(1) + '\'' + ', ' + '\'Shop' + '\'' + ', ' + '\'' + arr_name_photo[i][40:] + '\'' + ', ' + '\'' + arr_link[i] + '\'' + ');\n')
                                                                                                                                                                                                                                                                                                                 # It depends of site's code                                                                             

const setting = {
    port: 3000,
    linkFolder:'/public/static',  //  与⬇软链连接路径

    filePath: "C:\\Users\\zhangLei\\Desktop\\test",  // 查找路径
    reg: /\.(jpg|jpeg|png|MOV|mp4|HEIC)$/,   // 查找图片格式
    formatDate:'2022-10-28 10:00:00',


    gotify_url:'',
    gotify_token:'',

    mysql: {
        host: 'localhost', // 新建数据库连接时的 主机名或ID地址 内容
        user: 'root',
        password: '', // root 密码
        database: 'apitest', // 数据库名
        port: '3306'
    },
    Stu: {
        add: 'insert into axios_demo(stu_Id,stu_name,stu_sex,stu_college,stu_class) values (0,?,?,?,?)',
        show: 'select * from ?',
        del: 'delete from axios_demo where stu_Id = ?',
        update: 'update axios_demo set stu_name = ?,stu_sex = ?,stu_college = ?,stu_class = ? where stu_Id = ?'
    }
}

module.exports = setting;
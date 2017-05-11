function timeStamp2date (time){
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        return year + "-" + month + "-" + date;
};
function timeStamp2time (time){
        var datetime = new Date();
        datetime.setTime(time);
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        var second = datetime.getSeconds();
        return hour+":"+minute+":"+second;
};
function timeStamp2String (time){
        var datetime = new Date();
         datetime.setTime(time);
         var year = datetime.getFullYear();
         var month = datetime.getMonth() + 1;
         var date = datetime.getDate();
         var hour = datetime.getHours();
         var minute = datetime.getMinutes();
         var second = datetime.getSeconds();
         var mseconds = datetime.getMilliseconds();
         return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
};
function countLine (str,width){
    var count = 0;
    var lines = str.split("<br>");
    for (var i = lines.length - 1; i >= 0; i--) {
        if(lines[i].length == 0){
            count ++;
        }
        count += Math.ceil(lines[i].length/width);
    };
    return count;
};
function cutContent (str, line, width){
    var content = "";
    var lines = str.split("<br>");
    for (var i = line, j = 0; i > 0 && j < lines.length; ){
        if(lines[j].length < width){
            content += lines[j] + "<br>";
            i --;
            j ++;
        }
        else{
            contentHead = lines[j].substring(0,width);
            contentTail = lines[j].substring(width);
            i --;
            if(lines[j].length < width){
                content += lines[j] + "<br>";
                lines[j] = "";
                j ++;
            }
            else{
                lines[j] = contentTail;
                content += contentHead;
            }
        }
    };
    return content;
};
function restContent (str, sub){
    var rest = str.substring(sub.length);
    return rest;
};
jQuery(document).ready(function() {
        var id = (window.location.hash).split('#')[1];
        var template = _.template($('#list_template').html());
        $.ajax({
                type:       "GET",
                url:        'http://120.77.245.158:8088/api/Book/GetBookInfoById?_Id=' + id,
                dataType:   "json",
                success: function(data) {
                    //console.log(data);
                    $(document).attr("title",data.BookShelf.c_BookName);
                    $("#cover").attr("src","http://120.77.245.158:8088/api/Book/GetCoverImageByPath?BookName=" + data.BookShelf.c_BookName + "&Author=" + data.BookShelf.c_Author);
                    $(".book-name").html(data.BookShelf.c_BookName);
                    $(".author").html(data.BookShelf.c_Author + "·著");
                    options="";
                    var page=_.template($('#page_template').html());
                    var Spage=_.template($('#lonely_page_template').html());
                    var month=_.template($('#month_template').html());
                    var pages="";
                    for(var i = 0; i < data.bookDataOfPage_List.length; i++){
                        /*赞
                        var likes="";
                        for(var n=0;n < data[i].likes.length; n++){
                            likes += data[i].likes[n].userName + " ";
                        }
                        */
                        /*评论
                        var comment= _.template($('#comment').html());
                        var comments="";                       
                        for(var m=0;m < data[i].comments.length; m++){
                            comments += comment(
                                {
                                    authorName:     data[i].comments[m].authorName,
                                    content:        data[i].comments[m].content
                                });
                        }
                        */
                        $('#para_author*').html(data.BookShelf.c_Author);  
                        $('#para_bookName*').html(data.BookShelf.c_BookName);  
                        $('#para_from').html("<br>"+data.bookDataOfPage_List[0].c_MessageDate.split(' ')[0]);  
                        $('#para_to').html("<br>"+data.bookDataOfPage_List[data.bookDataOfPage_List.length - 1].c_MessageDate.split(' ')[0]); 
                        $('#para_id').html(data.BookShelf.c_ShelfCode); //only use for topdf page
                        var Simage=_.template($('#images').html());
                        var Dimage=_.template($('#double_images').html());
                        var Ximage=_.template($('#image_template').html());
                        var images="";
                        /*
                        if(data[i].mediaList.length > 0) {
                            imgsrc = (data[i].mediaList[0].indexOf("qpic.cn/mm")>0?"https://weixinshu.com/images/fetch?url=":"")+data[i].mediaList[0];
                            images = Ximage(
                            {
                                img:        imgsrc
                            });
                        }
                        else{
                            for(var img=0;img < data[i].mediaList.length; img+=2){
                                imgsrcA = (data[i].mediaList[img].indexOf("qpic.cn/mm")>0?"https://weixinshu.com/images/fetch?url=":"")+data[i].mediaList[img];
                                if(img + 2 > data[i].mediaList.length){
                                    imgsrcB="";
                                }
                                else{
                                    imgsrcB =  (data[i].mediaList[img+1].indexOf("qpic.cn/mm")>0?"https://weixinshu.com/images/fetch?url=":"")+data[i].mediaList[img+1]
                                };
                                //console.log(images);
                                images += Dimage(
                                    {
                                        imgA:       imgsrcA,
                                        imgB:       imgsrcB
                                    });
                            }
                        };
                        $('#para_date').html(timeStamp2String(data[i].timestamp*1000).split(" ")[0]);
                        $('#para_time').html(timeStamp2String(data[i].timestamp*1000).split(" ")[1]);
                        $('#para_img').html(images);                        
                        $('#para_content').html(data[i].content);
                        /*整体*/
                        /*
                        pages += page(
                        {
                            date:       timeStamp2date(data[i].timestamp*1000),
                            time:       timeStamp2time(data[i].timestamp*1000),
                            img:        images,
                            content:    data[i].content,
                            no:         i+1
                        })
                        /*
                        options += template(
                        {
                            authorName: data[i].authorName,
                            time:       timeStamp2String(data[i].timestamp*1000),
                            img:        images,
                            //img:        data[i].mediaList[0].indexOf("http://mmsns.qpic.cn/mmsns/")>0?"https://weixinshu.com/images/fetch?url=":""+data[i].mediaList[0],
                            content:    data[i].content,
                            likes:      likes,
                            comments:   comments
                        })
                        */
                    var hwRatio = 329.8;
                    var maxHeight = 580;
                    var widthPercent = 85;
                    var wordWidth = 17;
                    var pages="";
                    var pageNumber =0;
                    var surroundBool = 1;
                    for (var i = 0; i < data.bookDataOfPage_List.length; i++) {
                        /*月页*/
                        if(i==0 || data.bookDataOfPage_List[i].c_MessageDate.split(' ')[0].split('-')[1] != data.bookDataOfPage_List[i-1].c_MessageDate.split(' ')[0].split('-')[1]){
                            pages += month(
                            {
                                year:           data.bookDataOfPage_List[i].c_MessageDate.split(' ')[0].split('-')[0],
                                month:          data.bookDataOfPage_List[i].c_MessageDate.split(' ')[0].split('-')[1]
                            })
                            pageNumber ++;
                        }
                        pageNumber ++;
                        var images="";
                        var imageHeight = 0;
                        if(data.bookDataOfPage_List[i].ImgData_List.length == 0){ //Pure Content
                            console.log(pageNumber);
                        }
                        for (var j = 0; j < data.bookDataOfPage_List[i].ImgData_List.length; j+=2) {
                            //imgsrc ="";
                            var imgsrc1 = (data.bookDataOfPage_List[i].ImgData_List[j].c_PicUrl.indexOf("qpic.cn/mm")>0?"http://120.77.245.158:8088/api/ApiTools/GetPictureByUrl?_Url=":"")+data.bookDataOfPage_List[i].ImgData_List[j].c_PicUrl;
                            var w1 = data.bookDataOfPage_List[i].ImgData_List[j].c_Width;
                            var h1 = data.bookDataOfPage_List[i].ImgData_List[j].c_Height;
                            surroundBool = 1;
                            if((data.bookDataOfPage_List[i].ImgData_List.length==1||j==data.bookDataOfPage_List[i].ImgData_List.length-1)&&(w1/h1<1)&&(data.bookDataOfPage_List[i].c_Content.length > 100 || h1/w1 > 410/240)){
                                surroundBool = 0;
                                pages += Spage({
                                    img:                imgsrc1,
                                    width:              widthPercent/2,                                    
                                    content:            data.bookDataOfPage_List[i].c_Content,
                                    no:                 pageNumber,
                                    date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                    time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                    authorName:         data.BookShelf.c_Author,
                                    bookName:           data.BookShelf.c_BookName,
                                    yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月"                                    
                                })
                                continue;
                            }
                            //console.log(h1);
                            if(j+1 < data.bookDataOfPage_List[i].ImgData_List.length){ //Have Even Pics
                                var imgsrc2 = (data.bookDataOfPage_List[i].ImgData_List[j+1].c_PicUrl.indexOf("qpic.cn/mm")>0?"http://120.77.245.158:8088/api/ApiTools/GetPictureByUrl?_Url=":"")+data.bookDataOfPage_List[i].ImgData_List[j+1].c_PicUrl;
                                var w2 = data.bookDataOfPage_List[i].ImgData_List[j+1].c_Width;
                                var h2 = data.bookDataOfPage_List[i].ImgData_List[j+1].c_Height;
                                widthA = w1 * widthPercent / (w1 + w2*h1/h2) ;
                                widthB = (w2*h1/h2) * widthPercent / (w1 + w2*h1/h2) ;
                                imageHeight += h1 * hwRatio / (w1 + w2*h1/h2);
                                if(imageHeight > maxHeight){
                                    pages += page(
                                    {
                                        no:                 pageNumber,
                                        date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                        time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                        img:                images,
                                        content:            null,
                                        authorName:         data.BookShelf.c_Author,
                                        bookName:           data.BookShelf.c_BookName,
                                        yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月"                                    })
                                    images="";
                                    imageHeight = 0;
                                    pageNumber ++;
                                }
                            }
                            else{ //Only Odd Pic
                                imgsrc2 = "#";
                                widthA = widthPercent;
                                widthB = "0%;display:none;height:0";
                                imageHeight += h1 / w1 * hwRatio;
                                if(imageHeight > maxHeight){
                                    pages += page(
                                    {
                                        no:                 pageNumber,
                                        date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                        time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                        img:                images,
                                        content:            null,
                                        authorName:         data.BookShelf.c_Author,
                                        bookName:           data.BookShelf.c_BookName,
                                        yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月" 
                                    })
                                    images="";
                                    imageHeight = 0;
                                    pageNumber ++; 
                                }
                            }
                            images+=Ximage(
                            {
                                imgA:            imgsrc1,
                                imgB:            imgsrc2,
                                widthA:          widthA,
                                widthB:          widthB
                            })
                            //console.log(imageHeight);
                        };
                        if(surroundBool) { //not surround
                            var subContent = data.bookDataOfPage_List[i].c_Content;
                            var lines = countLine(subContent, wordWidth);
                            if(imageHeight + lines * 28 > maxHeight) { // Long Content
                                var restLine = parseInt((maxHeight - imageHeight) / 28);
                                var content_this = cutContent(subContent, restLine, wordWidth);// subContent.substring(0,parseInt((maxHeight-imageHeight)/28)*17-15);
                                subContent = restContent(subContent, content_this);// subContent.substring(parseInt((maxHeight-imageHeight)/28)*17-15);
                                pages += page(
                                {
                                    no:                 pageNumber,
                                    date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                    time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                    img:                images,
                                    content:            content_this,
                                    authorName:         data.BookShelf.c_Author,
                                    bookName:           data.BookShelf.c_BookName,
                                    yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月" 
                                })
                                pageNumber ++;
                                imageHeight = 0;
                                while(subContent.length > 0){
                                    var restLine = parseInt(maxHeight / 28);
                                    content_this = cutContent(subContent, restLine, wordWidth);//subContent.substring(0,parseInt((maxHeight-imageHeight)/28)*17-14);
                                    subContent = subContent = restContent(subContent, content_this);//subContent.substring(parseInt((maxHeight-imageHeight)/28)*17-14);
                                    pages += page(
                                    {
                                        no:                 pageNumber,
                                        date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                        time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                        img:                null,
                                        content:            content_this,
                                        authorName:         data.BookShelf.c_Author,
                                        bookName:           data.BookShelf.c_BookName,
                                        yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月" 
                                    })
                                    pageNumber ++;
                                }
                            }
                            else{ // Normal Content
                                pages += page(
                                {
                                    no:                 pageNumber,
                                    date:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[2],
                                    time:               data.bookDataOfPage_List[i].c_MessageDate.split(" ")[1],
                                    img:                images,
                                    content:            data.bookDataOfPage_List[i].c_Content,
                                    authorName:         data.BookShelf.c_Author,
                                    bookName:           data.BookShelf.c_BookName,
                                    yyyymm:             data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[0] + "年" + data.bookDataOfPage_List[i].c_MessageDate.split(" ")[0].split("-")[1] + "月" 
                                })
                            }
                        }
                        if(imageHeight>maxHeight){
                        console.log(data.bookDataOfPage_List[i].c_Content)
                        console.log(imageHeight);}
                    };                    
                    //console.log(data.bookDataOfPage_List[i]);
                    }
                    $("#page_lists").append(pages);
                    $("#page_lists").emojiParse(
                    {
                        icons: [{
                            path: "/assets/images/wx/",
                            file: ".png",
                            placeholder: "\\[{alias}]",
                            alias: {
                                0    :  "微笑", 
                                1    :  "撇嘴", 
                                2    :  "色", 
                                3    :  "发呆", 
                                4    :  "得意", 
                                5    :  "流泪", 
                                6    :  "害羞", 
                                7    :  "闭嘴", 
                                8    :  "睡", 
                                9    :  "大哭", 
                                10   :  "尴尬", 
                                11   :  "发怒", 
                                12   :  "调皮", 
                                13   :  "呲牙", 
                                14   :  "惊讶", 
                                15   :  "难过", 
                                16   :  "酷", 
                                17   :  "冷汗", 
                                18   :  "抓狂", 
                                19   :  "吐", 
                                20   :  "偷笑", 
                                21   :  "愉快", 
                                22   :  "白眼", 
                                23   :  "傲慢", 
                                24   :  "饥饿", 
                                25   :  "困", 
                                26   :  "惊恐", 
                                27   :  "流汗", 
                                28   :  "憨笑", 
                                29   :  "悠闲", 
                                30   :  "奋斗", 
                                31   :  "咒骂", 
                                32   :  "疑问", 
                                33   :  "嘘", 
                                34   :  "晕", 
                                35   :  "疯了", 
                                36   :  "衰", 
                                37   :  "骷髅", 
                                38   :  "敲打", 
                                39   :  "再见", 
                                40   :  "擦汗", 
                                41   :  "抠鼻", 
                                42   :  "鼓掌", 
                                43   :  "糗大了",
                                44   :  "坏笑", 
                                45   :  "左哼哼",
                                46   :  "右哼哼",
                                47   :  "哈欠", 
                                48   :  "鄙视", 
                                49   :  "委屈", 
                                50   :  "快哭了",
                                51   :  "阴险", 
                                52   :  "亲亲", 
                                53   :  "吓", 
                                54   :  "可怜", 
                                55   :  "菜刀", 
                                56   :  "西瓜", 
                                57   :  "啤酒", 
                                58   :  "篮球", 
                                59   :  "乒乓", 
                                60   :  "咖啡", 
                                61   :  "饭", 
                                62   :  "猪头", 
                                63   :  "玫瑰", 
                                64   :  "凋谢", 
                                65   :  "嘴唇", 
                                66   :  "爱心", 
                                67   :  "心碎", 
                                68   :  "蛋糕", 
                                69   :  "闪电", 
                                70   :  "炸弹", 
                                71   :  "刀", 
                                72   :  "足球", 
                                73   :  "瓢虫", 
                                74   :  "便便", 
                                75   :  "月亮", 
                                76   :  "太阳", 
                                77   :  "礼物", 
                                78   :  "拥抱", 
                                79   :  "强", 
                                80   :  "弱", 
                                81   :  "握手", 
                                82   :  "胜利", 
                                83   :  "抱拳", 
                                84   :  "勾引", 
                                85   :  "拳头", 
                                86   :  "差劲", 
                                87   :  "爱你", 
                                88   :  "NO", 
                                89   :  "OK", 
                                90   :  "爱情", 
                                91   :  "飞吻", 
                                92   :  "跳跳", 
                                93   :  "发抖", 
                                94   :  "怄火", 
                                95   :  "转圈", 
                                96   :  "磕头", 
                                97   :  "回头", 
                                98   :  "跳绳", 
                                99   :  "投降", 
                                100  :  "激动", 
                                101  :  "乱舞", 
                                102  :  "献吻", 
                                103  :  "左太极",
                                104  :  "右太极",
                                105  :  "捂脸",
                                106  :  "奸笑",
                                107  :  "耶",
                                108  :  "机智",
                                109  :  "嘿哈",
                                110  :  "皱眉",
                                111  :  "蜡烛",
                                112  :  "红包"
                            }
                        }]
                    });

                },
                error: function(data) {
                    console.log(data.length);
                }
            }
        )
});
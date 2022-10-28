var getexpress=require("express");
receivedexpress=getexpress();
var getmysql=require("mysql");
var fileuploader=require("express-fileupload");


//=====================mysql connection========================
var dbconfigurationobject={
    host:"localhost",
    user:"root",
    password:"",
    database:"placementportalproject",
}
 
var dbref=getmysql.createConnection(dbconfigurationobject);

dbref.connect(function(err){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("connected...hogya g  !!!!!!!");
    }
})



//===============================server connection===================
receivedexpress.listen(2005,function(){
    console.log("HEY HURRAH!!  SERVER GOT STARTED");
})
receivedexpress.use(getexpress.static("public"));// for incuding css
receivedexpress.get("/",function(req,resp){
    //resp.send("hi its homie!!!!!");
    //process:global object
    var purapath=process.cwd()+"/public/index.html";
    resp.sendFile(purapath);
})

//====================================== login and signup=========================
receivedexpress.get("/signup",function(req,res){

    var dataarr=[req.query.txtEmail,req.query.txtNo,req.query.txtPass];
    dbref.query("insert into students values(?,?,?,1,0)",dataarr,function(err,result){
        console.log(req.query.txtEmail+" "+req.query.txtNo+" "+req.query.txtPass);
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send("sign up successfully...");
        }
    })

    
})


receivedexpress.get("/login", function (req, res)  {

    dbref.query("select * from students where registrationno=? and password=?", [req.query.loginNo, req.query.loginPassword], function (err, result) {
        console.log(req.query.loginNo + " " + req.query.loginPassword);
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })

})

receivedexpress.get("/loginadmin", function (req, res)  {

    dbref.query("select * from officers where email=? and pwd=?", [req.query.loginOEmail, req.query.loginOPassword], function (err, result) {
        console.log(req.query.loginOEmail + " " + req.query.loginOPassword);
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })

})

//==========================student profile-================
receivedexpress.use(fileuploader());
receivedexpress.use(getexpress.urlencoded({extended:true}));
receivedexpress.post("/profile-process",function(req,resp){

    
     
    var fname=req.body.txtNo+"-"+req.files.profilePic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.profilePic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");  //===========
    })


    var proofpic=req.body.txtNo+"-"+req.files.proofPic.name;
    var des1=process.cwd()+"/public/uploads/"+ proofpic;
    req.files.proofPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })

//=========================profile insert=================================

      

    var dataAry=[req.body.txtName,req.body.txtNo,req.body.txtEmail,req.body.txtMobile,req.body.txtGender,req.body.txtFName,req.body.txtDob,req.body.txtBranch,req.body.txtAddr,req.body.txtState,req.body.txtCountry,req.body.idproof,req.body.txtYear,req.body.txtBacklog,req.body.txtmatric,req.body.txtdiploma,req.body.txtmarks,req.body.txtatten,proofpic,fname];
   dbref.query("insert into studentprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully.."); //msgs
   })



})
// to search and update buttons are pendeining


//================================placemnet of officers=======================

receivedexpress.get("/fetchAllStudentsRecords",function(req,res){
    dbref.query("select * from studentprofile",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})
//// 

receivedexpress.get("/delete-student",function(req,res){
    dbref.query("delete from studentprofile where regno=?",[req.query.regnoX],function(err,result){
        if(err)
            res.send(err);
        else
        if(result.affectedRows==0)
        res.send("Invalid Id");
        else
            res.send("Record Deleted Successfulllllyyyyy");
})
})

//=======make annoucemnet======================
receivedexpress.post("/annoucement-process",function(req,resp){
    
    var dataAry=[req.body.txtTitle,req.body.txtOemail,req.body.txtDetail,req.body.txtDate,req.body.txtCategory,req.body.txtname];
   dbref.query("insert into officersannouncement values(?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully.."); //msg
   })

})


//============================angular apis for category  and uploaded by (search announcement)==========================receivedexpress.get("/fetchAllAddr",function(req,resp)
receivedexpress.get("/fetchAllCategory",function(req,resp)
{
    dbref.query("select distinct category from officersannouncement ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

receivedexpress.get("/fetchannouncement",function(req,resp)
{    
dbref.query("select * from officersannouncement where category=?", [req.query.category], function (err, resultAryOfObjects) {

         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})
//=============create drives==================
receivedexpress.post("/drive-process",function(req,resp){
    
    var dataAry=[req.body.txtCode,req.body.txtCDate,req.body.txtRegisterby,req.body.txtCompany,req.body.txtEligible,req.body.txtDesignation,req.body.txtVenue,req.body.txtStatus];
   dbref.query("insert into officersdrive values(?,?,?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully.."); //
   })



})
//
receivedexpress.post("/drive-update",function(req,resp){
   
    var dataAry=[req.body.txtCDate,req.body.txtRegisterby,req.body.txtCompany,req.body.txtEligible,req.body.txtDesignation,req.body.txtVenue,req.body.txtStatus,req.body.txtCode];  
    
    dbref.query("update officersdrive set date=?, registerby=?, company=? , eligility=?, designation=?, venue=?, status=? where drivecode=?",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })



})

receivedexpress.get("/fetchAllDrivesRecords",function(req,res){
    dbref.query("select * from officersdrive",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})


//============================angular apis for reg no. in upcomig drive==========================
receivedexpress.get("/fetchAllRegisterationNo",function(req,resp)
{
    dbref.query("select distinct registrationno from students ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})



//=================================PLACEMNT STUDENT BLOCK/ RESUME using APIS ANGULAR===================================================================================================================
receivedexpress.get("/fetchAllRecords",function(req,res){
    dbref.query("select * from students",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

receivedexpress.get("/block-status",function(req,res){
    dbref.query("update students set status=0 where emailid=?",[req.query.emailid],function(err,result){
        // console.log("update  krne aa gya mai");
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("students Blocked");
        }
    })
})


receivedexpress.get("/resume-status",function(req,res){
    dbref.query("update students set status=1 where emailid=?",[req.query.emailid],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("students Un-Blocked");
        }
    })
})
//registereall-students//============================palacemnt register all students===============
receivedexpress.get("/registerallstudents",function(req,res){
  
    dbref.query("update students set registered=1",function(err,result){
        if(err)
        {
            
            console.log(err);
        }
        else
        {
            res.send("students registerd all");
        }
    })
})

receivedexpress.get("/deregisterallstudents",function(req,res){

     dbref.query("update students set registered=0",function(err,result){
         if(err)
         {
            
             console.log(err);
         }
         else
         {
             res.send("students registerd all");
         }
     })
 })

 //=====================view profile of students==========
 
 receivedexpress.get("/contactDonor",function(req,res){
    console.log("hii");
    dbref.query("select * from  studentprofile where studentemail=?",[req.query.studentemail],function(err,result){
        if(err)
            res.send(err);
        else
            res.send(result);
})
})
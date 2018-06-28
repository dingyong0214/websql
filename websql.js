/**
 * @author dingyong.
 * @version 1.0.0 build 20160718
 */
(function(localdb,db) {
	localdb.openDataBase=function(){
		try{
			db = openDatabase("LOCALDB", "1.0", "LOCALDB", 12 * 1024 * 1024, function() {});
			db&&createTable(db);
		}
		catch(e){}
	};
	localdb.createTable = function() {
		if(!db) return;
		db.transaction(function(tx) {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS  ShoppingCart (Id TEXT UNIQUE,TradeName TEXT,ImgUrl TEXT,TradePrice FLOAT,Quantity INT8, UserId TEXT,ProductId INT8,CreateTime DATETIME)", [],
				function(tx, result) {
				},
				function(tx, error) {
					mui.toast('create table error:' + error.message);
				});
		});
};
localdb.insertData = function(Id ,TradeName,ImgUrl ,TradePrice ,Quantity, UserId,ProductId,CreateTime,callback) {
	if(!db) return;
	db.transaction(function(tx) {
		tx.executeSql(
			"INSERT INTO ShoppingCart (Id ,TradeName,ImgUrl ,TradePrice ,Quantity, UserId,ProductId,CreateTime) values(?, ? , ? , ?, ?, ?,?,?)", [Id ,TradeName,ImgUrl ,TradePrice ,Quantity, UserId,ProductId,CreateTime],
			function(tx, result) {
				callback(true);
			},
			function(tx, error) {
				callback(false);
		});
	});
};
localdb.updateData = function(Id,Quantity,index,callback) {
	if(!db) return;
	var sql='UPDATE ShoppingCart SET Quantity = ? WHERE Id= ?';
	if(index){
		sql='UPDATE ShoppingCart SET Quantity =Quantity + ? WHERE Id= ?';
	}
	db.transaction(function(tx) {
		tx.executeSql(
			sql, [Quantity,Id],
			function(tx, result) {
				callback(true);
			},
			function(tx, error) {
				callback(false);
			});  
	});
};
localdb.deleteData = function(Ids,callback) {
		if(!db) return;
		var leng=Ids.length;
		var para='?';
		for(var i=1;i<leng;i++){
			para+=',?';
		}
		var sql='DELETE FROM ShoppingCart WHERE Id IN('+para+')';
		db.transaction(function(tx) {
			tx.executeSql(sql,Ids,function(tx, result) {
				 callback(true);
				},
				function(tx, error) {
					 callback(false);
				});
		});
};
localdb.queryData = function(UserId,callback) {
	if(!db) return;
	db.transaction(function(tx) {
		tx.executeSql(
			"SELECT * FROM ShoppingCart WHERE UserId=?  ORDER BY CreateTime DESC", [UserId],
			function(tx, results) { 
				if(results.rows && results.rows.length) {
					callback(results);
               }else{
                	callback(false);
                }
			},
			function(tx, error) {
				callback(false);
			});
	});
 };	
localdb.isExist=function(pid,uid,callback){
	if(!db) return;
	db.transaction(function(tx) { 
		tx.executeSql(
			"SELECT Id FROM ShoppingCart WHERE ProductId =? AND UserId=?", [pid,uid],
			function(tx, results) { 
				if(results.rows && results.rows.length) {
					callback(results);
               }else{
                	callback(false);
               }
			},
			function(tx, error) {
				callback(false);
			});
	});
 };
}(window.localdb={},window.db=null));
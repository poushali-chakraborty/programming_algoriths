
function pageload(){
	location.reload(true);
	
}



var edges=[];
var nodes=[];
var nodeLists=[];
var minEdges=[];
var vertexSets=[];
var lines=[]
var circles=[];
var texts=[];
var inputs=[];// it will contain a numbers of newObj objects

var co_ordiVals=new Array(50,100,150,200,250,300,350);
function clone(obj)// function to copy variables
{

 
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    let temp = obj.constructor(); // give temp the original obj's constructor
    for (let key in obj) {
        temp[key] = clone(obj[key]);
    }
 
    return temp;

    
}

var newObj = {
	/* it will have a <p> tag paragraph which will hold a label to identifiy each edge,
 a select tag to specify whether nodes
 are connected or not and lable and text box to enter weight*/
	
    init: function(a,b) {
		console.log("create input line");
        this.newrow=document.createElement('p');
		
		this.input= document.createElement("label");
		this.input.setAttribute("class", "title" );
		this.input.appendChild( document.createTextNode("Edge: "+a+","+b+ "->") );
		this.newrow.append( this.input );
		
		this.input= document.createElement("label");
		this.input.setAttribute("for", "connected" );
		this.input.setAttribute("class", "title" );
		this.input.appendChild( document.createTextNode("Nodes Connected") );
		this.newrow.append( this.input );
		
		
		this.input2= document.createElement("select");
		this.input2.setAttribute("name", "connected" );
		this.optn1= document.createElement("option");
		this.optn1.setAttribute("value", "no" );
		this.optn1.appendChild( document.createTextNode("no") );
		this.optn2= document.createElement("option");
		this.optn2.setAttribute("value", "yes" );
		this.optn2.appendChild( document.createTextNode("yes") );
		this.input2.appendChild(this.optn1);
		this.input2.appendChild(this.optn2);
		this.newrow.append( this.input2 );
		
		
		this.input3= document.createElement("label");
		this.input3.setAttribute("for", "weight" );
		this.input3.setAttribute("class", "title" );
		this.input3.appendChild( document.createTextNode("weight") );
		this.newrow.append( this.input3 );
		
		
		
		
		this.input4= document.createElement("input");
		
		this.input4.setAttribute("type", "text" );
		this.input4.setAttribute("name", "weight" );
		
		this.newrow.append(this.input4);
		document.getElementById("input-values").appendChild(this.newrow);//include p tag into holder input-values
		
    }
	
    
};

var myNode={ //store node and its addAdjacents node and co-ordinates to draw graph
	init:function(a,i)
	{
		this.node=a;
		this.index=i+1;
		
		this.adjacents=[];
	},
	addAdjacents:function(b)
	{
		this.adjacents.push(b);
	},
	addCordinate:function(x,y)
	{
		this.cordinateX=x;
		this.cordinateY=y;
	}
	
};

var myEdge={  //store edge and its weight
init:function(a,b,w)
{
	this.nodesEdge=[];
	this.nodesEdge.push(a);
	this.nodesEdge.push(b);
	this.weight=w;
},
show:function()
{
	console.log("edge shows=>"+this.nodesEdge[0]+","+this.nodesEdge[1]);
}
	
};


var line={
	init:function(x1,y1,x2,y2,aa,bb)
	{
		this.x= Number(x1);
		this.y=Number(y1);
		this.xi=Number(x2);
		this.yi=Number(y2);
		var a=clone(aa);
		var b=clone(bb);
		this.id=a+b;
		this.c=document.createElementNS("http://www.w3.org/2000/svg","line");
		this.c.setAttribute("x1",this.x );
		this.c.setAttribute("y1", this.y );
		this.c.setAttribute("x2",this.xi);
		
		this.c.setAttribute("y2",this.yi);
		this.c.setAttribute("stroke","#707070");
		this.c.setAttribute("id",this.id);
		document.getElementById('mysvg').appendChild(this.c);
	},
	change:function()//i has no use *****
	{
		this.d=document.createElementNS("http://www.w3.org/2000/svg","line");
		this.d.setAttribute("x1",this.x );
		this.d.setAttribute("y1", this.y );
		this.d.setAttribute("x2",this.xi);
		
		this.d.setAttribute("y2",this.yi);
		this.d.setAttribute("stroke","#f03d33");

		var rep= document.getElementById(this.id);
		document.getElementById('mysvg').replaceChild(this.d,rep);
	}
};


var circle={
	
	init:function(x,y)
	{
		var cx= Number(x);
		var cy=Number(y);
		this.c=document.createElementNS("http://www.w3.org/2000/svg","circle");
		this.c.setAttribute("class","myCircle" );
		this.c.setAttribute("fill","#f03d33" );
		this.c.setAttribute("cx",cx );
		this.c.setAttribute("cy", cy );
		this.c.setAttribute("r", 20 );
		document.getElementById('mysvg').appendChild(this.c);
	}
};
var tex={
	
	init:function(a,x,y)
	{
		var x= Number(x);
		var y=Number(y);
		this.c=document.createElementNS("http://www.w3.org/2000/svg","text");
		this.c.setAttribute("x",x );
		this.c.setAttribute("y", y );
		this.c.setAttribute("text-anchor","middle");
		this.c.appendChild( document.createTextNode(a))
		this.c.setAttribute("text-anchor","middle");
		document.getElementById('mysvg').appendChild(this.c);
	}
};


var vertex={
	init: function(a)
	{
		this.v=[];
		this.v.push(a);
		console.log("vetex created for "+a);
		
	},	
	union: function(b)//modified
	{
		for(let i=0;i<b.v.length;i++ )
		{this.v.push(b.v[i]);}
	},
	find: function(c)
	{
		let i;
		for(i=0;i<this.v.length;i++)
		{
			if(this.v[i]==c)
			{
				return true;
			}
		}
		return false;
	},
	show: function()
	{
		let i;
		for(i=0;i<this.v.length;i++)
		{
			console.log(this.v[i]);
		}
		
	}	
	
}

function sortEdges()
	{
		let temp,i,j;
		let n= edges.length;
		temp=clone(myEdge);
		let l1,r1;
		for( i=1; i<n; i++)
			{
			temp=edges[i];
			console.log(i+"::sort=> "+temp.weight);
			j=i-1;
			while((j>=0)&&(Number(edges[j].weight)>Number(temp.weight)))
				{
					console.log(i+":: sort=> "+temp.weight+">>>"+j);
					
					0
					
					
							
					edges[j+1]=clone(edges[j]);
						console.log("change");
							j--;
				
							
				}
			edges[j+1]=clone(temp);
			}
						
				
			
			
			console.log("sorted:");
		for( i=0; i<edges.length; i++)
		{
			edges[i].show();
		}
			console.log("lenght: "+edges.length);
		
	}



function draw_graph(){
	let i,j,x1,y1,x2,y2;
	for(i=0;i<nodeLists.length;i++)
	{
		let tmp= clone(nodeLists[i].node);
		console.log("node "+tmp);
		let tmp1=clone(nodeLists[i].cordinateX);
		let tmp2=clone(nodeLists[i].cordinateY);
		let demoNode=clone(nodeLists[i]);
		
		x1=clone(demoNode.cordinateX);
		y1=clone(demoNode.cordinateY);
		
		while(demoNode.adjacents.length)
		{
			let copy=clone(demoNode.adjacents.pop());
			console.log(copy);
			
			for(j=0;j<nodeLists.length;j++)
			{
					let t= clone(nodeLists[j]);
						if(t.node==copy)
						{
							let bb= clone(copy);
							let aa= clone(tmp);
							x2=clone(t.cordinateX);
							y2=clone(t.cordinateY);
							let myline=Object.create(line);
							myline.init(x1,y1,x2,y2,aa,bb);
							lines.push(myline);
							
						}
				
			}
		}
		circles[i]=clone(circle);
		 circles[i].init(clone(tmp1),clone(tmp2));
		 texts[i]=clone(tex);
		 texts[i].init(clone(tmp),clone(tmp1),clone(tmp2));
		 
		 
	}
	
	let but=document.createElement("input");
	but.setAttribute("class", "i1" );
	but.setAttribute("id", "i3" );
	but.setAttribute("type", "button" );
	
	but.setAttribute("onclick", "kruskal()" );
	let p=document.getElementById('submit');
	let c=document.getElementById('i2');
	p.replaceChild(but,c);
	
	let leg=document.createElement("label"); 
	leg.setAttribute("class","title-for-compute")
	leg.setAttribute("id","kruskal-mst");
	console.log("working");
	leg.appendChild( document.createTextNode("Create Kruskal MST"));
	
	let pp=document.getElementById('1');
	let cc=document.getElementById('connect-graph');
	
	pp.replaceChild(leg,cc);
	
	
}







//create nodes and way to put edges in the graph
function createGraph(n)
{
	
	let alpha=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	let number= parseInt(n,10);
	console.log(number);
	
	let num=clone(number);//important for copy
	let i,j,k=0;
	for(i=0;i<num;i++)
	{
		nodes[i]=alpha[i];
	}
	let edgeNos=number*(num-1)/2;
	for(i=0;i<num-1;i++)
	{
		
		for(j=i+1;j<num;j++)
		{
			
			if(k<edgeNos)
			{
				inputs[k]=  Object.create(newObj);//newObj will create objects which will allow to enter edges and their weights
		
		inputs[k].init(nodes[i],nodes[j]);//initialize newObj
		k=k+1;
			}
			
		}
	}
	
	let but=document.createElement("input");
	but.setAttribute("class", "i1" );
	but.setAttribute("id", "i2" );
	but.setAttribute("type", "button" );
	
	but.setAttribute("onclick", "connectGraph()" );
	let p=document.getElementById('submit');
	let c=document.getElementById('i1');
	p.replaceChild(but,c);
	
	let leg=document.createElement("label"); 
	leg.setAttribute("class","title-for-compute")
	leg.setAttribute("id","connect-graph");
	console.log("working");
	leg.appendChild( document.createTextNode("Connect Graph"));
	
	let pp=document.getElementById('1');
	let cc=document.getElementById('create-graph');
	
	pp.replaceChild(leg,cc);
	
}



let connectGraph= function(){
	
	let i,j,k,p;
	k=0;
	p=0;
	let w,ww,v,vv;
	w=1;
	ww=1;
	v=2;
	vv=2
	let len= nodes.length;
	let connected=document.getElementsByName('connected');
	let weight=document.getElementsByName('weight');
	
	for(i=0;i<len-1;i++)//not for the last node
	{
		let a=nodes[i];
		nodeLists[p]=Object.create(myNode); //nodeLists will be used to store nodes co-ordinates
		nodeLists[p].init(a);
		
		//while(ww==w)//cant remember why used**
		w=co_ordiVals[Math.floor(Math.random()*7)];//this will take random values from coordinate values array
													//as coordinate values array size is 7
		
		//while(vv==v)//cant remember why used**
		v=co_ordiVals[Math.floor(Math.random()*7)];//this will take random values from coordinate values array
													//as coordinate values array size is 7
													
													
		nodeLists[p].addCordinate(clone(w),clone(v));//create co-0rdinate for the graph node
		vv=clone(v);
		ww=clone(w);
		console.log(w+"::"+v);	

		for(j=i+1;j<len;j++)
		{
			let b=nodes[j];
			
			if(connected[k].value=="yes")
			{
				nodeLists[p].addAdjacents(b);
				let w1= clone(weight[k].value);
				let obj=Object.create(myEdge);
				console.log("edge created=>"+ a+":"+b+":::"+w1);
				obj.init(a,b,w1);
				let copy=clone(obj);
				copy.show();
				edges.push(copy);
				
				
			}
			k++;	
		}
		p++;
		
	}
	
		a=nodes[len-1];//for the last node 
		nodeLists[p]=Object.create(myNode);
		nodeLists[p].init(a);
		//while(ww==w)
		 w=co_ordiVals[Math.floor(Math.random()*7)];
		//while(vv==v)
		v=co_ordiVals[Math.floor(Math.random()*7)];
	
		nodeLists[p].addCordinate(clone(w),clone(v));
		vv=clone(v);
		ww=clone(w);
		console.log(w+"::"+v);
		
		
	
	
	draw_graph();//draw graph with nodes(vertices) and edges

sortEdges();


	
}


function kruskal()// work if input is given in sorted ascendin order
	{
		let i,j,ii,vi,ui;
		for(ii=0;ii<nodes.length;ii++)
		{
			vertexSets[ii]= Object.create(vertex);
			vertexSets[ii].init(nodes[ii]);
		}
		console.log("start kruskal");
		for(i=0;i<edges.length;i++)
		{
			console.log("start kruskal loop");
			edges[i].show();
			
			
			let u=clone(edges[i].nodesEdge[0]);
			let v=clone(edges[i].nodesEdge[1]);
			for(j=0;j<vertexSets.length;j++)
			{  
		
		console.log(j+" th vertexSet")
		vertexSets[j].show();
				
				if(vertexSets[j].find(u)===true)
				{ 
					ui=clone(j);
					break;
				}
			}
			for(j=0;j<vertexSets.length;j++)
			{
				if(vertexSets[j].find(v)===true)
				{
					vi=clone(j);
					break;
				}
			}
			if(ui!=vi)
			{ let n=vertexSets.length-1;
				minEdges.push(edges[i]);
				vertexSets[ui].union(vertexSets[vi]);
				
				let copy1= clone(vertexSets[vi]);
				vertexSets[vi]= clone(vertexSets[n]);
				vertexSets[n]=clone(copy1);
				 vertexSets.pop();
				console.log("not matched "+ui+"=="+vi);
				console.log("poped ");
				copy1.show();
				
				
			}
		}
		show_min();
	}


function show_min()
{
	let i,j;
	let input=[];
	
	for(i=0;i<minEdges.length;i++)
	{
		console.log("min edge "+minEdges[i].nodesEdge[0]+","+minEdges[i].nodesEdge[1]);
		let c=minEdges[i].nodesEdge[0]+minEdges[i].nodesEdge[1];
		let str= minEdges[i].nodesEdge.toString(); 
		input[i]= document.createElement('lable');
		input[i].setAttribute("class", "title" );
		input[i].appendChild( document.createTextNode(str) );
		document.getElementById('2').appendChild(input[i]);
		
		for(j=0;j<lines.length;j++)
		{
			if(lines[j].id==c)
			{
				lines[j].change();
			}
		}
	}
}























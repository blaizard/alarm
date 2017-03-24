// Higher definition curves
$fs = 0.1;

module createMeniscus(h,radius) // This module creates the shape that needs to be substracted from a cube to make its corners rounded.
difference(){        //This shape is basicly the difference between a quarter of cylinder and a cube
   translate([radius/2+0.1,radius/2+0.1,0]){
      cube([radius+0.2,radius+0.1,h+0.2],center=true);         // All that 0.x numbers are to avoid "ghost boundaries" when substracting
   }

   cylinder(h=h+0.2,r=radius,$fn = 25,center=true);
}


module roundCornersCube(x,y,z,r)  // Now we just substract the shape we have created in the four corners
difference(){
   cube([x,y,z], center=true);

    translate([x/2-r,y/2-r]){  // We move to the first corner (x,y)
      rotate(0){  
         createMeniscus(z,r); // And substract the meniscus
      }
   }
   translate([-x/2+r,y/2-r]){ // To the second corner (-x,y)
      rotate(90){
         createMeniscus(z,r); // But this time we have to rotate the meniscus 90 deg
      }
   }
      translate([-x/2+r,-y/2+r]){ // ... 
      rotate(180){
         createMeniscus(z,r);
      }
   }
      translate([x/2-r,-y/2+r]){
      rotate(270){
         createMeniscus(z,r);
      }
   }
}

usbWidth = 14;
module usb() {
    cube([7, 13.2, usbWidth], center = true);
}

powerWidth = 6;
module power() {
    cylinder(h=14, r=powerWidth/2, center=true);
}

module prism(l, w, h){
    polyhedron(
        points=[[0,0,0], [l,0,0], [l,w,0], [0,w,0], [0,w,h], [l,w,h]],
        faces=[[0,1,2,3],[5,4,3,2],[0,4,5,1],[0,3,4],[5,2,1]]
    );
}

height=125;
length=200;
width=20;
border=3;
shift=5;
screenYOffset = 3;

// Light shading
lsThickness = 6;

module createBox()
    color([0.6, 0.6, 0.6]) union() {
        difference() {
            cube([height, length, width], center = true);
            rotate([0, 0, 90])
                translate([-(length+1)/2, height/2-shift+0.1, -(width+1)/2])
                    prism(length+2, shift, width+1);
        }
        rotate([0, 0, 90])
            translate([-length/2, -height/2-shift+0.01, -width/2])
                prism(length, shift, width);
    };

module holes()
{
    holesBorder = 20;
    for (y=[-height/2+holesBorder+10:5:height/2-holesBorder])
        for (x=[-length/2+holesBorder:5:length/2-holesBorder])
            translate([y, x, -width/2+border/2])
                cube([4, 4, border+2], center=true);
}

module lightShader() {
    lsWidth = sqrt(width*width + shift*shift);
    
    // Offset due to the inclination of the case
    lsAngle = atan(shift/width);   
    lsOffset = tan(lsAngle)*lsThickness;
    
    
    color([1, 0.5, 0.5])
        rotate([180, 0, 90])
            translate([-length/2, -lsThickness, -lsWidth/2])
                union() {
                    polyhedron(
                        points = [
                            [border,  0,  border - lsOffset ],  //0 *
                            [length - border,  0,  border - lsOffset],  //1 *
                            [length,  lsThickness,  0 ],  //2
                            [0,  lsThickness,  0 ],  //3
                            [border,  0,  lsWidth - border - lsOffset ],  //4 *
                            [length - border,  0,  lsWidth - border - lsOffset],  //5 *
                            [length,  lsThickness,  lsWidth ],  //6
                            [0,  lsThickness,  lsWidth ]   //7
                        ],
                        faces = [
                            [0,1,2,3],  // bottom
                            [4,5,1,0],  // front
                            [7,6,5,4],  // top
                            [5,6,2,1],  // right
                            [6,7,3,2],  // back
                            [7,4,0,3]
                        ]
                    );
                };
};


module case() {
    difference() {
        // Main box
        difference() {
            createBox();
            scale([
                    (height-border*2)/height,
                    (length-border*2)/length,
                    (width-border*2)/width])
                createBox();
        }

        // Screen
        translate([screenYOffset, 0, (width)/2])
            union() {
                roundCornersCube(110.76+1, 192.96+1, 2, 7);
                translate([
                        (110.76-100.6)/2-6.63,
                        11.89-(192.96-166.2)/2,
                        -border/2])
                    cube([100.6+2, 166.2+2, border+1], center = true);
            };

         // Light shader   
        {
            lsAngle=atan(shift/width);
         //   lsAdjust=2.5; // ok for 10
            lsAdjust=0;
            echo("Angle is ", lsAngle);
            translate([height/2+lsThickness/2+0.001-lsAdjust, 0, -0])
                rotate([0, -lsAngle, 0])
                    lightShader();
        }
        
        // Holes
        holes();
        
        // Connectors
        union()
        {
            lsAngle=atan(shift/width);
            pcbHeight = 5;
            yPosition = -height/2 + shift + pcbHeight;

            // USB1
            translate([yPosition + 7/2, -25 -usbWidth/2, -width/2])
                rotate([0, -lsAngle, 0])
                    usb();
            // USB2
            translate([yPosition + 7/2, 25 + usbWidth/2, -width/2])
                rotate([0, -lsAngle, 0])
                    usb();
            
            // Power
            translate([yPosition + 7, 15, -width/2])
                rotate([0, -lsAngle, 0])
                    power();
        }
        
        // Holes for sensors
        union()
        {
            yPosition = -height/2 + 6;
            lsAngle=atan(shift/width);
            // Small hole
    /*        translate([yPosition, 3, width/2])
                rotate([0, -lsAngle, 0])
                    cylinder(h=14, r=0.5, center=true);
            // Big hole
            translate([yPosition, -3, width/2])
                rotate([0, -lsAngle, 0])
                    cylinder(h=14, r=1.5, center=true);*/
            // Hole for PCB
            translate([-height/2, 0,0])
                cube([20, length - border*2, width - border*2], center=true);
        }
        
        // Audio case
        {
            translate([shift, 0, -width/2-0.01-1])
                audioCase(0.5);
        }
        
        // Holes for proximity touch
        {
            translate([height/2-1, 0, -width/2+border])
                rotate([90, 0, 0])
                    cylinder(h=length-border*2, r=1, center=true);
        }
    }
};



module audioCase(expand) {
    audioCaseThickness = 2;
    connectorWidth = 100;
    connectorHeight = 20;
    connectorAngle = 45;

    module half()
        translate([-height+connectorHeight+height/2- expand, -length/2 - expand, 0])
            union()
            {
                cube([height - connectorHeight + expand*2, length/2+expand, audioCaseThickness]);
                w1 = (length-connectorWidth+expand*2)/2;
                w2 = w1 - connectorHeight/tan(connectorAngle);
                polyhedron(
                    points = [
                        [0,  0,  0 ],  //0 *
                        [-connectorHeight,  0,  0],  //1 *
                        [-connectorHeight,  w2,  0 ],  //2
                        [0,  w1,  0 ],  //3
                        [0,  0,  1 ],  //0 *
                        [-connectorHeight,  0,  1],  //1 *
                        [-connectorHeight,  w2,  1 ],  //2
                        [0,  w1,  1 ],  //3
                    ],
                    faces = [
                        [0,1,2,3],  // bottom
                        [4,5,1,0],  // front
                        [7,6,5,4],  // top
                        [5,6,2,1],  // right
                        [6,7,3,2],  // back
                        [7,4,0,3]
                    ]
                );
            };

    union()
    {
        half();
        mirror([0,1,0])
            half();
    }
};

//lightShader();
case();
/*
difference()
{
    union()
    {
        translate([shift, 0, -width/2-0.01])
           //     scale([10, 0, 0])
            audioCase(-0.5);
    };
    holes();
}*/

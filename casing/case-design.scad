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

usbWidth = 15;
module usb() {
    cube([7, 15, usbWidth], center = true);
}

module usbC() {
    cube([3, 10, 15], center = true);
}

powerWidth = 7;
module power() {
    cylinder(h=14, r=powerWidth/2, center=true);
}

module prism(l, w, h){
    polyhedron(
        points=[[0,0,0], [l,0,0], [l,w,0], [0,w,0], [0,w,h], [l,w,h]],
        faces=[[0,1,2,3],[5,4,3,2],[0,4,5,1],[0,3,4],[5,2,1]]
    );
}

height=125+4;
length=200;
width=20;
border=3;
shift=7.5;
screenYOffset = 3+2;

// Light shading
lsThickness = 3;

module createBox()
    color([0.6, 0.6, 0.6]) union() {
        difference() {
            cube([height, length, width], center = true);
            rotate([0, 0, 90])
                translate([-(length+1)/2, height/2-shift+0.1, -(width+1)/2])
                    prism(length+2, shift, width+1);
        }
        rotate([0, 0, 90])
            translate([-length/2, -height/2-shift, -width/2])
                prism(length, shift, width);
    };

module holes()
{
    holesBorder = 20;
    for (y=[-height/2+holesBorder+10:10:height/2-holesBorder])
        for (x=[-length/2+holesBorder:10:length/2-holesBorder])
            translate([y, x, -width/2+border/2])
                cube([4, 4, border+2], center=true);
    // Memory card access
  //  translate([5, 40, -width/2+border/2])
  //      cube([50, 50, border+2], center=true);
}
    

module lightShader(addToWidth, addToLength) {
    lsWidth = sqrt(width*width + shift*shift) + addToWidth;
    lsLength = length + addToLength;

    // Offset due to the inclination of the case
    lsAngle = atan(shift/width);   
    lsOffset = tan(lsAngle)*lsThickness;

    color([1, 0.5, 0.5])
        rotate([180, 0, 90])
            translate([-lsLength/2, -lsThickness, -lsWidth/2])
                union() {
                    polyhedron(
                        points = [
                            [border,  0,  border - lsOffset ],  //0 *
                            [lsLength - border,  0,  border - lsOffset],  //1 *
                            [lsLength,  lsThickness,  0 ],  //2
                            [0,  lsThickness,  0 ],  //3
                            [border,  0,  lsWidth - border - lsOffset ],  //4 *
                            [lsLength - border,  0,  lsWidth - border - lsOffset],  //5 *
                            [lsLength,  lsThickness,  lsWidth ],  //6
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
        createBox();

        // Holes
        holes();
        
        // Connectors
        union()
        {
            lsAngle=atan(shift/width);
            pcbHeight = 5-2;
            yPosition = -height/2 + shift + pcbHeight;

            // USB1
            translate([yPosition + 7/2, -25 -usbWidth/2+1-2, -width/2])
                rotate([0, -lsAngle, 0])
                    usb();
            // USB2
            translate([yPosition + 7/2, 25 + usbWidth/2-1, -width/2])
                rotate([0, -lsAngle, 0])
                    usb();
            
            // USB-C
            translate([yPosition + 7/2, -15 + usbWidth/2-1, -width/2])
                rotate([0, -lsAngle, 0])
                    usbC();
            
            // Power
            translate([yPosition + 7/2, 15, -width/2])
                rotate([0, -lsAngle, 0])
                    power();
        }
        
        // Holes for sensors
        union()
        {
            yPosition = -height/2 + 6;
            lsAngle=atan(shift/width);
            // Small hole
            translate([yPosition, 3, width/2])
                rotate([0, -lsAngle, 0])
                    cylinder(h=14, r=0.5, center=true);
            // Big hole
            translate([yPosition, -3, width/2])
                rotate([0, -lsAngle, 0])
                    cylinder(h=14, r=1.5, center=true);
            // Hole for PCB
            translate([-height/2, 0,0])
                cube([50, length - border*2 + 3, width - border*2 + 3], center=true);
        }
        
        // Audio case
        {
            translate([shift, 0, -width/2-0.01-1])
                audioCase(0.5);
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
             /*   polyhedron(
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
                );*/
            };

    union()
    {
        half();
        mirror([0,1,0])
            half();
    }
};


module base() {
    baseHeight = 10;
    baseTopWidth = sqrt(width*width+shift*shift);
    baseWidth = 60;
    baseLength = length;

    color([0.5, 1, 0.5])
        difference()
        {
                union() {
                    polyhedron(
                        points = [
                            [0,  0,  0],  //0 *
                            [baseLength,  0,  0],  //1 *
                            [baseLength,  baseHeight,  0 ],  //2
                            [0,  baseHeight,  0 ],  //3
                            [0,  0,  baseTopWidth],  //4 *
                            [baseLength,  0,  baseTopWidth],  //5 *
                            [baseLength,  baseHeight,  baseWidth],  //6
                            [0,  baseHeight,  baseWidth]   //7
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
                translate([-1,-1,baseWidth-10])
                    rotate([20,0,0])
                        cube([baseLength * 2, baseHeight * 2, baseTopWidth]);
        };
};

//lightShader(-3, -2);

/*
union()
{
    case();
    difference()
    {
        case();
        maxSize = max(length, width) * 2;
        rotate([0, 180, 0])
            translate([-52.5, -maxSize/2, -maxSize/2])
                cube(maxSize,center=false);
    }

    // hide the inside
    translate([-height/2+width/2, 0, width/2-2])
        cube([width - 2, length - 2, 2], center=true);
    translate([-height/2+width/2+shift, 0, -width/2+2])
        cube([width - 2, length - 2, 2], center=true);
}

difference()
{
    union()
    {
        translate([shift, 0, -width/2-0.01])
           //     scale([10, 0, 0])
            audioCase(-0.5);
    };
 //   holes();
}*/

base();


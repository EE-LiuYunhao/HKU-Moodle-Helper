mainFunction()


function mainFunction(){
  courseIDs = new Array()
  courseHTML = new Array()
  chrome.storage.sync.get({'courseIDs': []}, function(result) {
    clearAll()
    courseIDs = result.courseIDs
    console.log(courseIDs)


    var courses = document.getElementsByClassName("coursebox")
    for (var i = 0; i < courses.length; i++) {
      currentCourseID = courses[i].dataset.courseid
      var included = false
      if (courseIDs){ included = courseIDs.includes(currentCourseID) }
      if (included) {
        //如果在列表中
        //复制element，存入数组
        courseHTML.push(courses[i].cloneNode(true))

        courses[i].lastChild.lastChild.insertAdjacentHTML('beforebegin', `
          <button class="btn-warning helper-extension" id="removeCourse${currentCourseID}" style="margin-bottom:0px;margin-left:0px;order:4;">
            Remove from this semester
          </button>
        `)
        document.getElementById("removeCourse" + currentCourseID).addEventListener("click",function(e){
          removeCourse(e.target.id.slice(12), courseIDs)
        })
      } else {
        //如果不在列表中
        courses[i].lastChild.lastChild.insertAdjacentHTML('beforebegin',`
          <button class="btn-success helper-extension" id="addCourse${currentCourseID}" style="margin-bottom:0px;margin-left:0px;order:4;">
            Add to this semester
          </button>
        `)
        document.getElementById("addCourse" + currentCourseID).addEventListener("click",function(e){
          addCourse(e.target.id.slice(9), courseIDs)
        })
      }
    }


    var outerContainer = document.getElementById("frontpage-course-list")

    if (courseIDs && courseIDs.length){
      //如果有课程
      outerContainer.insertAdjacentHTML('afterbegin', `
        <div class="helper-extension">
          <h2>Course of this semester</h2>
          <button class="btn-default" id ="removeAll">Remove all courses from this semester</button>
          <div id="courseOfSem" class="courses frontpage-course-list-enrolled has-pre has-post course-of-sem"></div>
        </div>
      `)

      document.getElementById("removeAll").addEventListener("click", function(){
        if (confirm("Sure you wanna remove all courses from this semester?")){
          removeAll()
        }
      })
    } else {
      //没有课程
      outerContainer.insertAdjacentHTML('afterbegin', `
        <div class="helper-extension">
          <h2>Course of this semester</h2>
          <p><i>Please click 'Add to this semester' on a course to bring it here.</i></p>
        </div>
      `)
    }
    

    var innerContainer = document.getElementById("courseOfSem")
    for (var i = 0; i < courseHTML.length; i++) {
      if (i%2) {
        //注意这里是偶数 => 这里是不能整除2（i是奇数），但是在显示顺序上是“偶数”
        courseHTML[i].className = "coursebox clearfix even"
      }else{
        courseHTML[i].className = "coursebox clearfix odd"
      }

      currentCourseID = courseHTML[i].dataset.courseid
      courseHTML[i].insertAdjacentHTML('afterbegin', `
        <a id="removeCourseA${currentCourseID}" style="position: absolute; top: 5px; right: 5px; font-size: 25px; color: darkgrey; cursor: pointer">
          ×
        </a>
      `)
      innerContainer.appendChild(courseHTML[i])
      document.getElementById("removeCourseA" + currentCourseID).addEventListener("click",function(e){
        removeCourse(e.target.id.slice(13), courseIDs)
      })
    }
  });
}


function clearAll (){
  var clearElements = document.getElementsByClassName("helper-extension")
  //必须倒序删除，因为HTMLCollection会因为remove方法动态变化
  for (var i = clearElements.length - 1; i >= 0; --i) {
    clearElements[i].remove()
  }
}

function addCourse (courseCode, courseIDs){
  if (courseIDs && courseIDs.length){
    courseIDs.push(courseCode)
  }else{
    courseIDs=[courseCode]
  }
  chrome.storage.sync.set({courseIDs: courseIDs}, function() {
    mainFunction()
  });
}

function removeCourse (courseCode, courseIDs){
  courseIDs = courseIDs.filter(function(value, index, arr){
    return value !== courseCode;
  });
  chrome.storage.sync.set({courseIDs: courseIDs}, function() {
    mainFunction()
  });
}

function removeAll (){
  chrome.storage.sync.set({courseIDs: null}, function() {
    mainFunction()
  });
}
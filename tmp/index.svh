<!DOCTYPE html>
<html lang="en">

<head>
  <title>Server View Showcase</title>
</head>

<body>

  <h1>Welcome to the Server View Showcase!</h1>
  <p>
    This page demonstrates the powerful features of Server View. A server-side system for building dynamic web
    applications.
  </p>

  <hr>

  <h2>Server View HTML (SVH)</h2>
  <p>SVH is a templating language that allows you to build dynamic web pages with simple HTML-like tags.</p>

  <hr>

  <h3>1. Displaying System Information with <code>&lt;system&gt;</code></h3>
  <p>The <code>&lt;system&gt;</code> tag is used to display built-in, static server-side information.</p>
  <p><em>Example:</em></p>

  <code>&lt;p&gt;Running on version: &lt;system get="version"&gt;&lt;/system&gt;&lt;/p&gt;</code>

  <p><em>Output:</em></p>
  <p>Running on version: <system get="version"></system>
  </p>

  <hr>

  <h3>2. Accessing Request Data with <code>&lt;variable&gt;</code></h3>
  <p>The <code>&lt;variable&gt;</code> tag is used to access all dynamic data, including information from the incoming
    request.</p>

  <code>&lt;p&gt;URL requested: &lt;variable get="request.url"&gt;&lt;/variable&gt;&lt;/p&gt;</code>

  <p><em>Output:</em></p>
  <p>URL requested: <variable get="request.url"></variable>
  </p>

  <h4>Default Values</h4>
  <p>You can provide a default value for a variable if it is not defined.</p>

  <code>&lt;p&gt;User greeting: &lt;variable get="user.greeting" default="Hello, Guest!"&gt;&lt;/variable&gt;&lt;/p&gt;</code>

  <p><em>Output:</em></p>
  <p>User greeting: <variable get="user.greeting" default="Hello, Guest!"></variable>
  </p>

  <h4>Sanitizing HTML</h4>
  <p>You can sanitize a variable to prevent XSS attacks by stripping HTML tags from the output. Use the <code>sanitize="html"</code> attribute.</p>

  <code>&lt;p&gt;User comment: &lt;variable get="user.comment" sanitize="html" default="&lt;b&gt;Hello&lt;/b&gt;"&gt;&lt;/variable&gt;&lt;/p&gt;</code>

  <p><em>Output:</em></p>
  <p>User comment: <variable get="user.comment" sanitize="html" default="&lt;b&gt;Hello&lt;/b&gt;"></variable>
  </p>

  <h4>Variable Operations</h4>
  <p>You can perform operations on variables to transform their values.</p>

  <h5>Getting the Length of a Variable</h5>
  <p>You can get the length of a string or an array using the <code>:length</code> syntax in the <code>get</code> attribute of the <code>&lt;variable&gt;</code> tag.</p>

  <h6>String Length:</h6>
  <p><em>Example:</em></p>
  <code>&lt;p&gt;The length of the greeting is: &lt;variable get="greeting:length"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <p>The length of the greeting is: <variable get="greeting:length"></variable>
  </p>

  <h6>Array Length:</h6>
  <p><em>Example:</em></p>
  <code>&lt;p&gt;Number of courses: &lt;variable get="userData.courses:length"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <p>Number of courses: <variable get="userData.courses:length"></variable>
  </p>

  <h5>Changing Variable Case</h5>
  <p>You can change the case of a string variable using the <code>:toUpperCase</code> and <code>:toLowerCase</code> syntax.</p>

  <h6>To Upper Case:</h6>
  <p><em>Example:</em></p>
  <code>&lt;p&gt;User name in upper case: &lt;variable get="userData.name:toUpperCase"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <p>User name in upper case: <variable get="userData.name:toUpperCase"></variable>
  </p>

  <h6>To Lower Case:</h6>
  <p><em>Example:</em></p>
  <code>&lt;p&gt;User name in lower case: &lt;variable get="userData.name:toLowerCase"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <p>User name in lower case: <variable get="userData.name:toLowerCase"></variable>
  </p>

  <hr>

  <h3>3. Conditional Rendering with <code>&lt;condition&gt;</code></h3>
  <p>
    The <code>&lt;condition&gt;</code> tag allows you to conditionally render content based on a wide range of
    expressions.
  </p>

  <h4>Basic Booleans</h4>
  <p>You can use simple <code>true</code> or <code>false</code> values.</p>
  <p><em>Example:</em></p>

  <code>&lt;condition is="true"&gt;&lt;then&gt;This message is shown because the condition is true.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="true">
    <then>This message is shown because the condition is true.</then>
  </condition>

  <h4><code>defined</code> and <code>undefined</code></h4>
  <p>Check if a variable exists.</p>
  <p><em>Example:</em></p>

  <code>&lt;condition is="userData defined"&gt;&lt;then&gt;The 'userData' variable is defined.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData defined">
    <then>The 'userData' variable is defined.</then>
  </condition>

  <h4>Numeric Comparisons</h4>
  <p>Perform comparisons on numeric values.</p>
  <ul>
    <li><code>==</code> (equal)</li>
    <li><code>!=</code> (not equal)</li>
    <li><code>&gt;</code> (greater than)</li>
    <li><code>&lt;</code> (less than)</li>
    <li><code>&gt;=</code> (greater than or equal to)</li>
    <li><code>&lt;=</code> (less than or equal to)</li>
  </ul>
  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.age &gt;= 18"&gt;&lt;then&gt;User is an adult.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>
  <condition is="userData.age >= 18">
    <then>User is an adult.</then>
  </condition>

  <h4>String Comparisons</h4>
  <p>Perform comparisons on string values. Remember to use single quotes for literal strings.</p>
  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.name == 'John Doe'"&gt;&lt;then&gt;The user's name is John Doe.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData.name == 'John Doe'">
    <then>The user's name is John Doe.</then>
  </condition>

  <h4><code>contains</code> Operator</h4>
  <p>Check if a string contains a substring or an array contains an element.</p>
  <p><em>String Example:</em></p>

  <code>&lt;condition is="userData.name contains 'Doe'"&gt;&lt;then&gt;Name contains 'Doe'.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData.name contains 'Doe'">
    <then>Name contains 'Doe'.</then>
  </condition>

  <p><em>Array Example:</em></p>

  <code>&lt;condition is="userData.courses.title contains 'Math'"&gt;&lt;then&gt;User is enrolled in a Math course.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData.courses.title contains 'Math'">
    <then>User is enrolled in a Math course.</then>
  </condition>

  <h4>Logical Operators: <code>and</code>, <code>or</code>, <code>not</code></h4>
  <p>Combine multiple conditions together.</p>
  <p><em><code>and</code> Example:</em></p>

  <code>&lt;condition is="userData.age &gt; 18 and userData.address.city == 'New York'"&gt;&lt;then&gt;User is an adult living in New York.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData.age > 18 and userData.address.city == 'New York'">
    <then>User is an adult living in New York.</then>
  </condition>

  <p><em><code>or</code> Example:</em></p>

  <code>&lt;condition is="userData.courses.title contains 'Science' or userData.courses.title contains 'Math'"&gt;&lt;then&gt;User is taking a STEM course.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>

  <condition is="userData.courses.title contains 'Science' or userData.courses.title contains 'Math'">
    <then>User is taking a STEM course.</then>
  </condition>

  <p><em><code>not</code> Example:</em></p>

  <code>&lt;condition is="not userData.isAdmin"&gt;&lt;then&gt;User is not an admin.&lt;/then&gt;&lt;/condition&gt;</code>
  
  <p><em>Output:</em></p>
  <condition is="not userData.isAdmin">
    <then>User is not an admin.</then>
  </condition>

  <h4>Grouping with Parentheses</h4>
  <p>Use parentheses to group expressions and control the order of evaluation.</p>
  <p><em>Example:</em></p>
  <code>&lt;condition is="(userData.age &gt; 18 and userData.age &lt; 65) and not userData.isStudent"&gt;&lt;then&gt;User is a working-age adult and not a student.&lt;/then&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="(userData.age > 18 and userData.age < 65) and not userData.isStudent">
    <then>User is a working-age adult and not a student.</then>
  </condition>
  <hr>

  <h3>4. Including Local Files with <code>&lt;include&gt;</code></h3>
  <p>You can embed content from other files directly into your page. Here we are including the content of
    <code>include.svh</code>:</p>
  <p><em>Example:</em></p>
  <code>&lt;include src="include.svh"&gt;&lt;/include&gt;</code>
  <p><em>Output:</em></p>
  <include src="include.svh"></include>

  <hr>

  <h3>5. Fetching and Displaying Variables with <code>&lt;fetch&gt;</code> and <code>&lt;variable&gt;</code></h3>
  <p>You can fetch data from a URL and store it in a user-defined variable with the <code>&lt;fetch&gt;</code> tag. You
    can then display the content of these variables using the <code>&lt;variable&gt;</code> tag.</p>
  <p><em>Example:</em></p>
  <code>&lt;fetch href="/example.txt" as="fileContent"&gt;&lt;/fetch&gt;</code><br>
  <code>&lt;p&gt;Fetched content: &lt;variable get="fileContent"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <fetch href="/example.txt" as="fileContent"></fetch>
  <p>Fetched content: <variable get="fileContent"></variable>
  </p>

  <hr>

  <h3>6. Handling JSON Data</h3>
  <p>You can fetch JSON data and access its properties using dot notation.</p>
  <p><em>Example:</em></p>
  <code>&lt;fetch href="/user.json" as="userData"&gt;&lt;/fetch&gt;</code><br>
  <code>&lt;p&gt;User's Name: &lt;variable get="userData.name"&gt;&lt;/variable&gt;&lt;/p&gt;</code><br>
  <code>&lt;p&gt;User's Age: &lt;variable get="userData.age"&gt;&lt;/variable&gt;&lt;/p&gt;</code><br>
  <code>&lt;p&gt;User's City: &lt;variable get="userData.address.city"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
  <p><em>Output:</em></p>
  <fetch href="/user.json" as="userData"></fetch>
  <p>User's Name: <variable get="userData.name"></variable>
  </p>
  <p>User's Age: <variable get="userData.age"></variable>
  </p>
  <p>User's City: <variable get="userData.address.city"></variable>
  </p>

  <hr>

  <h3>7. Iterating over Data with <code>&lt;iterate&gt;</code></h3>
  <p>You can loop over arrays in your data and render content for each item.</p>
  <p><em>Example:</em></p>

  <code>
            <pre>
            &lt;table border="1"&gt;
              &lt;thead&gt;
                &lt;tr&gt;
                  &lt;th&gt;Course Title&lt;/th&gt;
                  &lt;th&gt;Credits&lt;/th&gt;
                &lt;/tr&gt;
              &lt;/thead&gt;
              &lt;tbody&gt;
                &lt;iterate over="userData.courses" as="course"&gt;
                  &lt;tr&gt;
                    &lt;td&gt;&lt;variable get="course.title" /&gt;&lt;/td&gt;
                    &lt;td&gt;&lt;variable get="course.credits" /&gt;&lt;/td&gt;
                  &lt;/tr&gt;
                &lt;/iterate&gt;
              &lt;/tbody&gt;
            &lt;/table&gt;
            </pre>
            </code>
            
  <p><em>Output:</em></p>
  <table border="1">
    <thead>
      <tr>
        <th>Course Title</th>
        <th>Credits</th>
      </tr>
    </thead>
    <tbody>
      <iterate over="userData.courses" as="course">
        <tr>
          <td>
            <variable get="course.title" />
          </td>
          <td>
            <variable get="course.credits" />
          </td>
        </tr>
      </iterate>
    </tbody>
  </table>

  <hr>

  <h3>8. Advanced Conditional Rendering with `defined` and `undefined`</h3>
  <p>You can check if a variable has been defined, which is useful for dynamically rendering content based on fetched
    data or other server-side logic.</p>
  <h4>Checking for a defined variable:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="userData defined"&gt;&lt;then&gt;The variable 'userData' is defined!&lt;/then&gt;&lt;else&gt;The variable 'userData' is not defined.&lt;/else&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="userData defined">
    <then>The variable 'userData' is defined!</then>
    <else>The variable 'userData' is not defined.</else>
  </condition>

  <h4>Checking for an undefined variable:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="nonExistentVar undefined"&gt;&lt;then&gt;The variable 'nonExistentVar' is not defined, so this message is shown.&lt;/then&gt;&lt;else&gt;This will not appear.&lt;/else&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="nonExistentVar undefined">
    <then>The variable 'nonExistentVar' is not defined, so this message is shown.</then>
    <else>This will not appear.</else>
  </condition>

  <h4>Checking for a nested property in a JSON object:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="userData.address defined"&gt;&lt;then&gt;The 'userData.address' property exists.&lt;/then&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="userData.address defined">
    <then>The 'userData.address' property exists.</then>
  </condition>

  <h4>Checking for a non-existent nested property:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="userData.nonexistentProperty undefined"&gt;&lt;then&gt;This message appears because 'userData.nonexistentProperty' is indeed undefined.&lt;/then&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="userData.nonexistentProperty undefined">
    <then>This message appears because 'userData.nonexistentProperty' is indeed undefined.</then>
  </condition>

  <hr>

  <h3>9. Numeric Comparisons in Conditions</h3>
  <p>You can perform numeric comparisons in your conditions.</p>

  <h4>Greater Than:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="userData.age > 18"&gt;&lt;then&gt;User is older than 18.&lt;/then&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="userData.age > 18">
    <then>User is older than 18.</then>
  </condition>

  <h4>Less Than or Equal To:</h4>
  <p><em>Example:</em></p>
  <code>&lt;condition is="userData.age <= 30"&gt;&lt;then&gt;User is 30 or younger.&lt;/then&gt;&lt;/condition&gt;</code>
  <p><em>Output:</em></p>
  <condition is="userData.age <= 30">
    <then>User is 30 or younger.</then>
  </condition>

  <h4>Equality:</h4>

  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.age == 30"&gt;&lt;then&gt;User is exactly 30.&lt;/then&gt;&lt;else&gt;User is not 30.&lt;/else&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.age == 30">
    <then>User is exactly 30.</then>
    <else>User is not 30.</else>
  </condition>



  <h4>False Conditions:</h4>

  <p><em>Example (userData.age > 40):</em></p>

  <code>&lt;condition is="userData.age > 40"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is not > 40.&lt;/else&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.age > 40">
    <then>This will not be displayed.</then>
    <else>userData.age is not > 40.</else>
  </condition>



  <p><em>Example (userData.age < 20):</em>
  </p>

  <code>&lt;condition is="userData.age < 20"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is not < 20.&lt;/else&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.age < 20">
    <then>This will not be displayed.</then>
    <else>userData.age is not < 20.</else>
  </condition>



  <p><em>Example (userData.age != 30):</em></p>



  <code>&lt;condition is="userData.age != 30"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is 30.&lt;/else&gt;&lt;/condition&gt;</code>



  <p><em>Output:</em></p>



  <condition is="userData.age != 30">
    <then>This will not be displayed.</then>
    <else>userData.age is 30.</else>
  </condition>







  <hr>







  <h3>10. String Comparisons in Conditions</h3>



  <p>You can perform string comparisons in your conditions. Remember to enclose the string in single quotes.</p>







  <h4>Equality:</h4>



  <p><em>Example:</em></p>



  <code>&lt;condition is="userData.name == 'John Doe'"&gt;&lt;then&gt;User is John Doe.&lt;/then&gt;&lt;/condition&gt;</code>



  <p><em>Output:</em></p>



  <condition is="userData.name == 'John Doe'">
    <then>User is John Doe.</then>
  </condition>







  <h4>Inequality:</h4>



  <p><em>Example:</em></p>



  <code>&lt;condition is="userData.name != 'Jane Doe'"&gt;&lt;then&gt;User is not Jane Doe.&lt;/then&gt;&lt;/condition&gt;</code>



  <p><em>Output:</em></p>



  <condition is="userData.name != 'Jane Doe'">
    <then>User is not Jane Doe.</then>
  </condition>







  <h4>False Condition:</h4>



  <p><em>Example:</em></p>



  <code>&lt;condition is="userData.name == 'Jane Doe'"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;User is not Jane Doe.&lt;/else&gt;&lt;/condition&gt;</code>



  <p><em>Output:</em></p>



  <condition is="userData.name == 'Jane Doe'">
    <then>This will not be displayed.</then>
    <else>User is not Jane Doe.</else>
  </condition>







  <hr>

  <h3>11. Contains Operator in Conditions</h3>

  <p>You can check if a string contains a substring or if an array contains a specific value.</p>

  <h4>String Contains:</h4>

  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.name contains 'Doe'"&gt;&lt;then&gt;User's name contains 'Doe'.&lt;/then&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.name contains 'Doe'">
    <then>User's name contains 'Doe'.</then>
  </condition>

  <h4>Array Contains:</h4>

  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.courses.title contains 'Math'"&gt;&lt;then&gt;User is enrolled in Math.&lt;/then&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.courses.title contains 'Math'">
    <then>User is enrolled in Math.</then>
  </condition>

  <h4>False Condition:</h4>

  <p><em>Example:</em></p>

  <code>&lt;condition is="userData.name contains 'Smith'"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;User's name does not contain 'Smith'.&lt;/else&gt;&lt;/condition&gt;</code>

  <p><em>Output:</em></p>

  <condition is="userData.name contains 'Smith'">
    <then>This will not be displayed.</then>
    <else>User's name does not contain 'Smith'.</else>
  </condition>

  <hr>

  <h3>12. Setting Variables with <code>&lt;set&gt;</code></h3>

  <p>You can define a variable directly in your SVH file using the <code>&lt;set&gt;</code> tag. This is useful for
    creating reusable values or for improving readability.</p>

  <p><em>Example:</em></p>

  <code>&lt;set as="greeting" value="Hello, World!"&gt;&lt;/set&gt;</code><br>

  <code>&lt;p&gt;&lt;variable get="greeting"&gt;&lt;/variable&gt;&lt;/p&gt;</code>

  <p><em>Output:</em></p>

  <set as="greeting" value="Hello, World!"></set>

  <p>
    <variable get="greeting"></variable>
  </p>


  <hr>

  <h3>13. Defining Macros with <code>&lt;define&gt;</code></h3>
  <p>You can define reusable blocks of content as macros using the <code>&lt;define&gt;</code> tag. Macros can accept
    parameters.</p>
  <p><em>Example:</em></p>
  <code>
                                                <pre>
&lt;define name="greetUser" params="userName,city"&gt;
  &lt;p&gt;Hello, &lt;variable get="userName"&gt;&lt;/variable&gt; from &lt;variable get="city"&gt;&lt;/variable&gt;!&lt;/p&gt;
&lt;/define&gt;
                                                </pre>
                                                </code>
  <p><em>Output:</em></p>
  <define name="greetUser" params="userName,city">
    <p>Hello, <variable get="userName"></variable> from <variable get="city"></variable>!</p>
  </define>

  <hr>

  <h3>14. Calling Macros with <code>&lt;call&gt;</code></h3>
  <p>Once defined, you can call a macro using the <code>&lt;call&gt;</code> tag and pass parameters using the
    <code>with</code> attribute (as a JavaScript object literal).</p>
  <p><em>Example:</em></p>
  <code>
                                                <pre>
&lt;call name="greetUser" with="{userName:'Alice', city:'Wonderland'}"&gt;&lt;/call&gt;
                                                </pre>
                                                </code>
  <p><em>Output:</em></p>
  <call name="greetUser" with="{userName:'Alice', city:'Wonderland'}"></call>

  <hr>

  <h3>15. Using Switch and Case</h3>

  <p>The <code>&lt;switch&gt;</code> and <code>&lt;case&gt;</code> elements provide a structured way to handle conditional logic.</p>

  <p><em>Example:</em></p>

  <code>
    <pre>
&lt;switch on="userData.role"&gt;
  &lt;case is="'admin'"&gt;
    &lt;p&gt;Welcome, administrator!&lt;/p&gt;
  &lt;/case&gt;
  &lt;case is="'editor'"&gt;
    &lt;p&gt;Welcome, editor!&lt;/p&gt;
  &lt;/case&gt;
  &lt;default&gt;
    &lt;p&gt;Welcome, user!&lt;/p&gt;
  &lt;/default&gt;
&lt;/switch&gt;
    </pre>
  </code>

  <p><em>Output:</em></p>
  <switch on="userData.role">
    <case is="'admin'">
      <p>Welcome, administrator!</p>
    </case>
    <case is="'editor'">
      <p>Welcome, editor!</p>
    </case>
    <default>
      <p>Welcome, user!</p>
    </default>
  </switch>

</body>

</html>
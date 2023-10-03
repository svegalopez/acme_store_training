export default function (parent, child) {
  /*
  Clues:  
    1. Check if the child element is the same as the parent element. 
       If they are the same, then the child element is a descendant 
       of the parent element.
    2. If they are not the same, the function proceeds to traverse up 
       the DOM tree from the child element to its parent elements using 
       a while loop. In each iteration of the loop, the function checks 
       if the current node is the same as the parent element. If it is, 
       then the child element is a descendant of the parent element.
    4. If the function reaches the root of the DOM tree (i.e., the node 
       variable becomes null) without finding the parent element, then the 
       child element is not a descendant of the parent element.
    5. Return true if the child element is a descendant of the parent element,
       otherwise return false.
  */
}

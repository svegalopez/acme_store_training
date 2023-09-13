export default function (parentId, child) {
  const parent = document.getElementById(parentId);

  if (child === parent) {
    return true;
  }

  let node = child.parentNode;
  while (node) {
    if (node === parent) {
      return true;
    }

    // Traverse up to the parent
    node = node.parentNode;
  }

  // Climbed up until the root but couldn't find the parent
  return false;
}

export default function (parent, child) {
  if (parent === child) {
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

  // Climbed up to the root but couldn't find the parent
  return false;
}

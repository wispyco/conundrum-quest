export const Markers = (array) => {
  return array.map((obj) => {
    console.log(obj);
    return {
      color: obj.color,
      fontFamily: obj.fontFamily,
      padding: parseInt(obj.padding),
      text: obj.text,
      link: obj.link,
      left: parseInt(obj.left),
      top: parseInt(obj.top),
      width: parseInt(obj.width),
      height: parseInt(obj.height),
      rotationAngle: parseInt(obj.rotationAngle),
      typeName: obj.typeName,
      state: obj.state,
      visualTransformMatrix: {
        a: obj.visualTransformMatrix.a,
        b: obj.visualTransformMatrix.b,
        c: obj.visualTransformMatrix.c,
        d: obj.visualTransformMatrix.d,
        e: obj.visualTransformMatrix.e,
        f: obj.visualTransformMatrix.f,
      },
      containerTransformMatrix: {
        a: obj.containerTransformMatrix.a,
        b: obj.containerTransformMatrix.b,
        c: obj.containerTransformMatrix.c,
        d: obj.containerTransformMatrix.d,
        e: obj.containerTransformMatrix.e,
        f: obj.containerTransformMatrix.f,
      },
    };
  });
};

export const convertDataChart = (data, type) => {
  try {
    const object = {}
    Array.isArray(data) && data.forEach((opt) => {
      if (!object[opt[type]]) {
        object[opt[type]] = 1
      } else {
        object[opt[type]] += 1
      }
    })
    console.log("object", object);
    console.log("Object.keys(object)", Object.keys(object));
    const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
      return {
        name: item,
        value: object[item]
      }
    })
    console.log("results", results);

    return results

  } catch (e) {
    return []
  }
}
// BÀI 1

const student1 = {
    name: 'hoang',
    parent: {
        name: 'bo hoang'
    }
}
const mentor1 = { ...student1 }
mentor1.name = 'bang'
mentor1.parent.name = 'bo bang'
console.log('--- Bài 1 ---')
console.log('student1:', student1)
console.log('mentor1:', mentor1)

/*
Câu trả lời:
1.student.name có bị đổi không?
→ KHÔNG (vẫn là 'hoang')
2.student.parent.name có bị đổi không?
→ CÓ (bị đổi thành 'bo bang')
3.Giải thích:
- spread (const mentor = { ...student1}) là shallow copy (copy nông)
- name là primitive → copy riêng
- parent là object → copy reference (dùng chung vùng nhớ)
*/



// BÀI 2
const student2 = {
    name: 'hoang',
    parent: {
        name: 'bo hoang'
    }
}
const mentor2 = JSON.parse(JSON.stringify(student2))
mentor2.parent.name = 'bo bang'
console.log('\n--- Bài 2 ---')
console.log('student2:', student2)
console.log('mentor2:', mentor2)

/*
Câu trả lời:
1.student.parent.name có bị ảnh hưởng không?
→ KHÔNG (vẫn là 'bo hoang')
2.Vì sao khác spread?
→ JSON.parse(JSON.stringify()) là deep copy (copy sâu)
→ Tạo object hoàn toàn mới, không dùng chung reference
*/



// BÀI 3
const students = [
    { name: 'a' },
    { name: 'b' }
]
const newStudents = [...students]
newStudents[0].name = 'z'
console.log('\n--- Bài 3 ---')
console.log('students:', students)
console.log('newStudents:', newStudents)

/*
Câu trả lời:
1.Mảng có bị thay đổi không?
→ KHÔNG (structure không đổi)
2.Phần tử bên trong có bị không?
→ CÓ (students[0].name thành 'z')
Giải thích:
- Spread array chỉ copy mảng (shallow)
- Object bên trong vẫn dùng chung reference
*/



// BÀI 4
const user = {
    name: 'hoang',
    address: {
        city: 'HN',
        location: {
            lat: 123
        }
    }
}
const newUser = { ...user }
newUser.address.location.lat = 999
console.log('\n--- Bài 4 ---')
console.log('user.address.location.lat:', user.address.location.lat)

/*
Câu trả lời:
1.Kết quả là bao nhiêu?
→ 999
2.Vì sao?
→ Spread chỉ copy tầng 1
→ address và location vẫn là reference cũ
→ Sửa newUser → user bị ảnh hưởng
*/

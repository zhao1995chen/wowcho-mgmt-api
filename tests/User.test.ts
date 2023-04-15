// 會員相關
import request from 'supertest'
import app from '../app'

describe('修改會員資料', () => {
  let token: string

  beforeAll(async () => {
    // 先登入取得 token 和 ID
    const loginResponse = await request(app)
      .post('/log-in')
      .send({
        // 填入用戶資料
        account: 'user@example.com',
        password: 'password123'
      })

    token = loginResponse.body.token
  })

  test('修改使用者名稱和密碼', async () => {
    const response = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        password: 'newpassword123'
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('New Name')
  })

  test('無效的 token', async () => {
    const response = await request(app)
      .post('/profile')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        name: 'New Name',
        password: 'newpassword123'
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('無效的 token')
  })

  test('未提供使用者名稱或密碼', async () => {
    const response = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('account and password are required')
  })

  test('用戶不存在', async () => {
    const response = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        password: 'newpassword123'
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('找不到用戶')
  })
})
